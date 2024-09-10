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
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class api_UserController extends AbstractController
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

    #[Route('/api/editUser/{id}', name: 'api_user_update', methods: ['PATCH'])]
    public function updateUser(Request $request, int $id): JsonResponse
    {
        var_dump('dddddddd');
        $user = $this->entityManager->getRepository(User::class)->find($id);
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_UNAUTHORIZED);
        }
        if ($this->getUser() !== $user) {
            throw new AccessDeniedException('You can only update your own profile.');
        }
        // $username = $request->request->get('username');
        // $email = $request->request->get('email');
        // $password = $request->request->get('password');
        // $confirmPassword = $request->request->get('confirmPassword');
        // $profilePicture = $request->files->get('profilePicture');
        $data = json_decode($request->getContent(), true);
        // $data = [
        //     'username' => $username,
        //     'email' => $email,
        //     'password' => $password,
        //     'confirmPassword' => $confirmPassword,
        // ];

        $constraints = new Assert\Collection([
            'username' => [new Assert\NotBlank(), new Assert\Type('string')],
            'email' => [new Assert\NotBlank(), new Assert\Email()],
            'password' => [new Assert\Optional(new Assert\Length(['min' => 6]))],
            'confirmPassword' => [new Assert\Optional(new Assert\EqualTo(['value' => $data['password'] ?? '']))],
        ]);

        $violations = $this->validator->validate($data, $constraints);

        if (count($violations) > 0) {
            $errors = [];
            foreach ($violations as $violation) {
                $errors[] = $violation->getPropertyPath() . ': ' . $violation->getMessage();
            }
            return new JsonResponse(['error' => $errors], Response::HTTP_BAD_REQUEST);
        }

        // Vérification si le pseudo existe déjà
        if (isset($data['username']) && $user->getPseudo() !== $data['username']) {
            $existingUserPseudo = $this->entityManager->getRepository(User::class)->findOneBy(['pseudo' => $data['username']]);
            if ($existingUserPseudo) {
                return new JsonResponse(['error' => 'This username is already used.'], Response::HTTP_CONFLICT);
            }
            $user->setPseudo($data['username']);
        }

        // Vérification si l'email existe déjà
        if (isset($data['email'])  && $user->getEmail() !== $data['email']) {
            $existingUserEmail = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
            if ($existingUserEmail) {
                return new JsonResponse(['error' => 'This email is already used.'], Response::HTTP_CONFLICT);
            }
            $user->setEmail($data['email']);
        }
        if (isset($data['password'])) {
            $user->setPassword(
                $this->passwordHasher->hashPassword($user, $data['password'])
            );
        }
        $profilePicture = $request->files->get('profilePicture');
        if ($profilePicture) {
            $fileName = uniqid() . '.' . $profilePicture->guessExtension();
            $profilePicture->move($this->getParameter('avatar_directory'), $fileName);
            $user->setImageName($fileName);
        }
      
        //$this->entityManager->persist($user);
        $this->entityManager->flush();

        return new JsonResponse(['success' => 'User update successfully'], Response::HTTP_CREATED);
    }
}
