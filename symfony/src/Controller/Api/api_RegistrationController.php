<?php

namespace App\Controller\Api;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class api_RegistrationController extends AbstractController
{
    private $entityManager;
    private $passwordHasher;
    private $validator;

    public function __construct(
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher,
        ValidatorInterface $validator
    ) {
        $this->entityManager = $entityManager;
        $this->passwordHasher = $passwordHasher;
        $this->validator = $validator;
    }

    #[Route('/api/users', name: 'api_user_register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return new JsonResponse(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        $constraints = new Assert\Collection([
            'username' => [new Assert\NotBlank(), new Assert\Type('string')],
            'email' => [new Assert\NotBlank(), new Assert\Email()],
            'password' => [new Assert\NotBlank(), new Assert\Type('string')],
            'confirmPassword' => [new Assert\NotBlank(), new Assert\Type('string')],
        ]);

        $violations = $this->validator->validate($data, $constraints);

        if (count($violations) > 0) {
            return new JsonResponse(['error' => (string) $violations], Response::HTTP_BAD_REQUEST);
        }

        if ($data['password'] !== $data['confirmPassword']) {
            return new JsonResponse(['error' => 'Passwords do not match'], Response::HTTP_BAD_REQUEST);
        }

        $user = new User();
        $user->setPseudo($data['username']);
        $user->setEmail($data['email']);
        $user->setPassword(
            $this->passwordHasher->hashPassword($user, $data['password'])
        );

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return new JsonResponse(['success' => 'User registered successfully'], Response::HTTP_CREATED);
    }
}
