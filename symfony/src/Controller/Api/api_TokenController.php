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
use Symfony\Component\Routing\Annotation\Route;

class api_TokenController extends AbstractController
{
    private $jwtManager;
    private $manager;

    public function __construct(JWTTokenManagerInterface $jwtManager, EntityManagerInterface $manager)
    {
        $this->jwtManager = $jwtManager;
        $this->manager = $manager;
    }

    #[Route('/api/refresh_token', name: 'api_refresh_token', methods: ['POST'])]
    public function refreshToken(Request $request): JsonResponse
    {
        // var_dump("blabla");

        $refreshToken = $request->get('refresh_token');
        // var_dump($refreshToken);

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
        $refreshTokenEntity = $this->manager->getRepository(RefreshToken::class)->findOneBy(['refresh_token' => $refreshToken]);
        if ($refreshTokenEntity) {
            return $this->manager->getRepository(User::class)->findOneByEmail($refreshTokenEntity->getUsername());
        }
        return null;
    }
}