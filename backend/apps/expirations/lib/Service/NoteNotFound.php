<?php

namespace OCA\Expirations\Service;

class NoteNotFound extends \Exception {

    public function __construct($message = "Item not found (note)", Throwable $previous = null) {
        $code = 404;
        parent::__construct($message, $code, $previous);
    }
}
