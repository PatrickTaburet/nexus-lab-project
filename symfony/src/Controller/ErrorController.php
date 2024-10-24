<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

class ErrorController extends AbstractController
{
    public function show($exception): Response
    {
        $statusCode = $exception->getStatusCode();
        
        return $this->render('error/index.html.twig', [
            'status_code' => $statusCode,
            'exception' => $exception,
        ]);
    }
}