<?php

namespace OCA\Expirations\Service;

class ExceptionError extends \Exception {

    public function __construct($message = "Item not found", Throwable $previous = null) {
        $code = 404;
        parent::__construct($message, $code, $previous);
    }
}
