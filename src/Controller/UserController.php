<?php

namespace App\Controller;

use App\Form\EditUserType;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class UserController extends AbstractController
{
    
    /**
    * @Route("/profile/{id}", name="profile", methods= {"GET", "POST"})
    */
    public function editUser(EntityManagerInterface $entityManager,Request $request, UserRepository $repo, $id) : Response
    {       
            $user = $repo->find($id);
            
            $userForm = $this->createForm(EditUserType::class, $user, [
                'is_admin' => false,
                'is_not_admin' =>true,
            ]);
            $userForm -> handleRequest($request);

            if ($userForm->isSubmitted() && $userForm->isValid()) {
                $entityManager->persist($user);
                $entityManager->flush();
                $user->removeFile(); // Delete the object file after persist to avoid errors
                $this ->addFlash('message', 'User edit succeed');

                return $this->redirectToRoute('home');
            }

            return $this->render('user/editUser.html.twig', [
                'user' => $user,
                'userForm' => $userForm->createView(),
            ]);
    } 
}
