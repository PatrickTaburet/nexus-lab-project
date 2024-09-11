<?php

namespace App\Controller\Api;

use App\Entity\User;
use App\Entity\RefreshToken;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class api_TokenController extends AbstractController
{
    private $jwtManager;
    private $manager;

    public function __construct(JWTTokenManagerInterface $jwtManager, EntityManagerInterface $manager)
    {
        $this->jwtManager = $jwtManager;
        $this->manager = $manager;
    }

    public function refreshToken(Request $request): JsonResponse
    {
        $refreshToken = $request->get('refresh_token');
        $isValid = $this->isValidRefreshToken($refreshToken);
        if (!$isValid){
            throw new AccessDeniedException('Invalid Token');
        }
        $user = $this->getUserFromRefreshToken($refreshToken);
        if (!$user instanceof User){
            throw new AccessDeniedException('Invalid User');
        }
        $accessToken = $this->jwtManager->create($user);
        return new JsonResponse(['token' => $accessToken]);
    }

    private function isValidRefreshToken($refreshToken): bool
    {
        $refreshTokenEntity = $this->manager->getRepository(RefreshToken::class)->findOneBy(['refresh_token' => $refreshToken]);
        return $refreshTokenEntity && $refreshTokenEntity->isValid();
    }

    private function getUserFromRefreshToken($refreshToken): ?User
    {
        $refreshTokenUserEmail = $this->manager->getRepository(RefreshToken::class)->findOneBy(['refresh_token' => $refreshToken]);
        $refreshTokenEntity = $this->manager->getRepository(User::class)->findOneByEmail([$refreshTokenUserEmail->getUsername()]);
        return $refreshTokenEntity ? $refreshTokenEntity : null;
    }
}