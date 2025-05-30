<?php

namespace App\EventListener;

use App\Entity\User;
use App\Entity\RefreshToken;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;

class RefreshTokenListener
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function onAuthenticationSuccess(AuthenticationSuccessEvent $event)
    {
        $data = $event->getData();
        $user = $event->getUser();

        if (!$user instanceof User) {
            return;
        }
        $existingRefreshToken = $this->entityManager->getRepository(RefreshToken::class)->findOneBy([
            'username' => $user->getEmail(),
        ]);
        if ($existingRefreshToken && $existingRefreshToken->isValid()) {
            $refreshToken = $existingRefreshToken->getRefreshToken();
        } else {
            // supprimer l'ancien refresh token
            $refreshToken = $this->generateRefreshToken();
            $this->saveRefreshToken($refreshToken, $user->getEmail());
        }
        $data['refresh_token'] = $refreshToken;
        $expirationDate = $this->getRefreshTokenExpiration($refreshToken);
        $data['refresh_token_expiration'] = $expirationDate->getTimestamp();

        $event->setData($data);
    }

    private function generateRefreshToken()
    {
        return bin2hex(random_bytes(32));
    }

    private function saveRefreshToken($refreshToken, $username): void
    {
        $refreshTokenEntity = new RefreshToken($refreshToken, $username);
        $this->entityManager->persist($refreshTokenEntity);
        $this->entityManager->flush();
    }

    private function getRefreshTokenExpiration($refreshToken): \DateTimeInterface
    {
        $refreshTokenEntity = $this->entityManager->getRepository(RefreshToken::class)->findOneBy(['refresh_token' => $refreshToken]);

        return $refreshTokenEntity ? $refreshTokenEntity->getValid() : new \DateTime('+30 days');
    }
}
