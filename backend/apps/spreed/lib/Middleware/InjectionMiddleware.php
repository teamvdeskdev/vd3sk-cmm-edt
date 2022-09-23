<?php
declare(strict_types=1);
/**
 * @copyright Copyright (c) 2019 Joas Schilling <coding@schilljs.com>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

namespace OCA\Spreed\Middleware;

use OC\AppFramework\Utility\ControllerMethodReflector;
use OCA\Spreed\Controller\AEnvironmentAwareController;
use OCA\Spreed\Controller\EnvironmentAwareTrait;
use OCA\Spreed\Exceptions\ParticipantNotFoundException;
use OCA\Spreed\Exceptions\RoomNotFoundException;
use OCA\Spreed\Manager;
use OCA\Spreed\Middleware\Exceptions\LobbyException;
use OCA\Spreed\Middleware\Exceptions\NotAModeratorException;
use OCA\Spreed\Middleware\Exceptions\ReadOnlyException;
use OCA\Spreed\Room;
use OCA\Spreed\TalkSession;
use OCA\Spreed\Webinary;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Response;
use OCP\AppFramework\Http\RedirectToDefaultAppResponse;
use OCP\AppFramework\Middleware;
use OCP\AppFramework\OCS\OCSException;
use OCP\AppFramework\OCSController;
use OCP\IRequest;
use OCP\IUserSession;

class InjectionMiddleware extends Middleware {

	/** @var IRequest */
	private $request;
	/** @var ControllerMethodReflector */
	private $reflector;
	/** @var TalkSession */
	private $talkSession;
	/** @var Manager */
	private $manager;
	/** @var ?string */
	private $userId;

	public function __construct(IRequest $request,
								ControllerMethodReflector $reflector,
								TalkSession $talkSession,
								Manager $manager,
								?string $userId) {
		$this->request = $request;
		$this->reflector = $reflector;
		$this->talkSession = $talkSession;
		$this->manager = $manager;
		$this->userId = $userId;
	}

	/**
	 * @param Controller $controller
	 * @param string $methodName
	 * @throws RoomNotFoundException
	 * @throws ParticipantNotFoundException
	 * @throws NotAModeratorException
	 * @throws ReadOnlyException
	 * @throws LobbyException
	 */
	public function beforeController($controller, $methodName): void {
		if (!$controller instanceof AEnvironmentAwareController) {
			return;
		}

		if ($this->reflector->hasAnnotation('RequireLoggedInParticipant')) {
			$this->getLoggedIn($controller, false);
		}

		if ($this->reflector->hasAnnotation('RequireLoggedInModeratorParticipant')) {
			$this->getLoggedIn($controller, true);
		}

		if ($this->reflector->hasAnnotation('RequireParticipant')) {
			$this->getLoggedInOrGuest($controller, false);
		}

		if ($this->reflector->hasAnnotation('RequireModeratorParticipant')) {
			$this->getLoggedInOrGuest($controller, true);
		}

		if ($this->reflector->hasAnnotation('RequireReadWriteConversation')) {
			$this->checkReadOnlyState($controller);
		}

		if ($this->reflector->hasAnnotation('RequireModeratorOrNoLobby')) {
			$this->checkLobbyState($controller);
		}
	}

	/**
	 * @param AEnvironmentAwareController $controller
	 * @param bool $moderatorRequired
	 * @throws NotAModeratorException
	 */
	protected function getLoggedIn(AEnvironmentAwareController $controller, bool $moderatorRequired): void {
		$token = $this->request->getParam('token');
		$room = $this->manager->getRoomForParticipantByToken($token, $this->userId);
		$controller->setRoom($room);

		$participant = $room->getParticipant($this->userId);
		$controller->setParticipant($participant);

		if ($moderatorRequired && !$participant->hasModeratorPermissions(false)) {
			throw new NotAModeratorException();
		}
	}

	/**
	 * @param AEnvironmentAwareController $controller
	 * @param bool $moderatorRequired
	 * @throws NotAModeratorException
	 * @throws ParticipantNotFoundException
	 */
	protected function getLoggedInOrGuest(AEnvironmentAwareController $controller, bool $moderatorRequired): void {
		$token = $this->request->getParam('token');
		$room = $this->manager->getRoomForParticipantByToken($token, $this->userId);
		$controller->setRoom($room);

		if ($this->userId !== null) {
			$participant = $room->getParticipant($this->userId);
		} else {
			$sessionId = $this->talkSession->getSessionForRoom($token);
			$participant = $room->getParticipantBySession($sessionId);
		}
		$controller->setParticipant($participant);

		if ($moderatorRequired && !$participant->hasModeratorPermissions()) {
			throw new NotAModeratorException();
		}
	}

	/**
	 * @param AEnvironmentAwareController $controller
	 * @throws ReadOnlyException
	 */
	protected function checkReadOnlyState(AEnvironmentAwareController $controller): void {
		$room = $controller->getRoom();
		if (!$room instanceof Room || $room->getReadOnly() === Room::READ_ONLY) {
			throw new ReadOnlyException();
		}
	}

	/**
	 * @param AEnvironmentAwareController $controller
	 * @throws LobbyException
	 */
	protected function checkLobbyState(AEnvironmentAwareController $controller): void {
		try {
			$this->getLoggedInOrGuest($controller, true);
			return;
		} catch (NotAModeratorException $e) {
		} catch (ParticipantNotFoundException $e) {
		}

		$room = $controller->getRoom();
		if (!$room instanceof Room || $room->getLobbyState() !== Webinary::LOBBY_NONE) {
			throw new LobbyException();
		}
	}

	/**
	 * @param Controller $controller
	 * @param string $methodName
	 * @param \Exception $exception
	 * @throws \Exception
	 * @return Response
	 */
	public function afterException($controller, $methodName, \Exception $exception): Response {
		if ($exception instanceof RoomNotFoundException ||
			$exception instanceof ParticipantNotFoundException) {
			if ($controller instanceof OCSController) {
				throw new OCSException('', Http::STATUS_NOT_FOUND);
			}

			return new RedirectToDefaultAppResponse();
		}

		if ($exception instanceof LobbyException) {
			if ($controller instanceof OCSController) {
				throw new OCSException('', Http::STATUS_PRECONDITION_FAILED);
			}

			return new RedirectToDefaultAppResponse();
		}

		if ($exception instanceof NotAModeratorException ||
			$exception instanceof ReadOnlyException) {
			if ($controller instanceof OCSController) {
				throw new OCSException('', Http::STATUS_FORBIDDEN);
			}

			return new RedirectToDefaultAppResponse();
		}

		throw $exception;
	}
}
