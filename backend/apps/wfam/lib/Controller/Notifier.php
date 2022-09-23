<?php
namespace OCA\Wfam\Controller;

use OCP\Notification\INotification;
use OCP\Notification\INotifier;

class Notifier implements INotifier {
	protected $factory;
	protected $urlGenerator;

	public function __construct(\OCP\L10N\IFactory $factory,
								\OCP\IURLGenerator $urlGenerator) {
		$this->factory = $factory;
		$this->urlGenerator = $urlGenerator;
	}

	/**
	 * Identifier of the notifier, only use [a-z0-9_]
	 *
	 * @return string
	 * @since 17.0.0
	 */
	public function getID(): string {
		return 'wfam';
	}

	/**
	 * Human readable name describing the notifier
	 *
	 * @return string
	 * @since 17.0.0
	 */
	public function getName(): string {
		return $this->l10nFactory->get('wfam')->t('wfam');
	}
		/**
	 * @param INotification $notification
	 * @param string $languageCode The code of the language that should be used to prepare the notification
	 * @return INotification
	 * @throws \InvalidArgumentException When the notification was not prepared by a notifier
	 */
	public function prepare(INotification $notification, $languageCode): INotification {
		if ($notification->getApp() !== 'wfam') {
			throw new \InvalidArgumentException('Unknown app');
		}

		switch ($notification->getSubject()) {
			case 'ocs':
				$link= $notification->getLink();
				$subjectParams = $notification->getSubjectParameters();
				if(empty($link)){		
					$link=$this->urlGenerator->linkToRoute('wfam.page.index', array('pid' => $subjectParams[1]));
				}
				$notification->setParsedSubject($subjectParams[0]);
				$messageParams = $notification->getMessageParameters();
				if (isset($messageParams[0]) && $messageParams[0] !== '') {
					$notification->setParsedMessage($messageParams[0]);
				}

				$notification->setIcon($this->urlGenerator->getAbsoluteURL($this->urlGenerator->imagePath('notifications', 'notifications-dark.svg')));					
				$notification->setRichSubject($subjectParams[0])->setLink($link);							
				return $notification;

			default:
				throw new \InvalidArgumentException('Unknown subject');
		}
	}	
}
