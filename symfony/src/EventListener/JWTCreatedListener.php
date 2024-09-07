<?php

namespace App\EventListener;

use App\Entity\User;
use Symfony\Component\Security\Core\User\UserInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JWTCreatedListener
{
    public function onJWTCreated(JWTCreatedEvent $event)
    {
        $payload = $event->getData();
        $user = $event->getUser();
        if ($user instanceof User) {
            $payload['id'] = $user->getId(); 
        }
        $event->setData($payload);
    }
}
