<?php

namespace App\Controller;

use App\Form\EditUserType;
use App\Form\UserPasswordType;
use App\Repository\Scene1Repository;
use App\Repository\SceneD1Repository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserController extends AbstractController
{
    
    /**
    * @Route("/profile/edit/{id}", name="profile", methods= {"GET", "POST"})
    */
    public function editUser(EntityManagerInterface $entityManager,Request $request, UserRepository $repo, $id) : Response
    {       
            $user = $repo->find($id);
            // Check if the user is logged
            if (!$this->getUser()) {
                return $this->redirectToRoute('app_login');
            }
            
            // Check if the logged-in user is the same as the user being edited
            if ($this->getUser() !== $user) {
                // If not, redirect the user to the home page
                return $this->redirectToRoute('home');
            }
            
            $userForm = $this->createForm(EditUserType::class, $user, [
                'is_admin' => false,
                'is_not_admin' =>true,
            ]);
            
            $userForm -> handleRequest($request);
            
            if ($userForm->isSubmitted() && $userForm->isValid()) {
                // limit the file upload to 5MB maximum
                if ($user->getImageFile() && $user->getImageFile()->getSize() > 5000000) {
                    $user->setImageFile(null);
                    $this->addFlash('error', 'The file is too large. Maximum file size is 5 MB.');
                    return $this->render('user/editUser.html.twig', [
                        'user' => $user,
                        'userForm' => $userForm->createView(),
                    ]);
                }
                // dd($user->getImageFile()->getSize());
                $entityManager->persist($user);
                $entityManager->flush();
                $user->removeFile(); // Delete the object file after persist to avoid errors
                $this ->addFlash('success', 'User informations successfully edited');

                return $this->redirectToRoute('home');
            }

            return $this->render('user/editUser.html.twig', [
                'user' => $user,
                'userForm' => $userForm->createView(),
            ]);
    } 
    
    /**
    * @Route("/profile/edit/password/{id}", name="editPassword", methods= {"GET", "POST"})
    */
    public function editPassword(EntityManagerInterface $entityManager, Request $request, UserRepository $repo, $id, UserPasswordHasherInterface $hasher ): Response
    {
        $user = $repo->find($id);

        // Check if the user is logged
        if (!$this->getUser()) {
            return $this->redirectToRoute('app_login');
        }
        
        // Check if the logged-in user is the same as the user being edited
        if ($this->getUser() !== $user) {
            // If not, redirect the user to the home page
            return $this->redirectToRoute('home');
        }

        $form = $this->createForm(UserPasswordType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) { 
            $plainPassword = $form->get('plainPassword')->getData();
            $newPassword = $form->get('newPassword')->getData();
        
            if($hasher->isPasswordValid($user, $plainPassword)){
                $user->setPassword(
                    $hasher->hashPassword($user, $newPassword)
                );
                
                $entityManager->persist($user);
                $entityManager->flush();

                $this ->addFlash('success', 'User password successfully edited');
                return $this->redirectToRoute('profile', ['id' => $id]);

            } else {
                $this ->addFlash('warning', 'Incorrect password');
            }
        }
        return $this->render('user/editPassword.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    /**
    * @Route("/profile/myArtworks/{id}", name="myArtworks", methods= {"GET", "POST"})
    */
    public function myArtworks(Scene1Repository $repoG1, SceneD1Repository $repoD1, $id) : Response
    {       
        $data = [
            'scene1' => $repoG1->findAll(),
            'sceneD1' => $repoD1->findAll(),
        ];
        
        return $this->render('user/myArtworks.html.twig', [
            'artworks' => $data,
        ]);
    } 
}
