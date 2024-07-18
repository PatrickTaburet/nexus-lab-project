<?php

namespace App\Controller;

use App\Entity\ArtistRole;
use App\Form\EditUserType;
use App\Form\ArtistRoleType;
use App\Form\UserPasswordType;
use App\Form\SaveArtworkD1Type;
use App\Form\SaveArtworkD2Type;
use App\Form\SaveArtworkG1Type;
use App\Form\SaveArtworkG2Type;
use App\Repository\UserRepository;
use App\Repository\Scene1Repository;
use App\Repository\Scene2Repository;
use App\Repository\SceneD1Repository;
use App\Repository\SceneD2Repository;
use App\Repository\ArtistRoleRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

/**
* @Route("/profile")
*/

class UserController extends AbstractController
{
    
    /**
    * @Route("/edit/{id}", name="profile", methods= {"GET", "POST"})
    */
    public function editUser(EntityManagerInterface $entityManager,Request $request, UserRepository $repo, $id) : Response
    {       
            $user = $repo->find($id);

            // Check if the user is logged
            if (!$this->getUser()) {
                return $this->redirectToRoute('gallery');
            }
            // Check if the logged-in user is the same as the user being edited
            if ($this->getUser() !== $user) {
                // If not, redirect the user to the home page
                return $this->redirectToRoute('home');
            }
            
            $userForm = $this->createForm(EditUserType::class, $user, [
                'is_admin' => false,
            ]);
            
            $userForm -> handleRequest($request);
            
            if ($userForm->isSubmitted() && $userForm->isValid()) {
                // limit the file upload to 5MB maximum
                if ($user->getImageFile() && $user->getImageFile()->getSize() > 5000000) {
                    $user->setImageFile(null);
                    $this->addFlash('warning', 'The file is too large. Maximum file size is 5 MB.');
                    return $this->render('user/editUser.html.twig', [
                        'user' => $user,
                        'userForm' => $userForm->createView(),
                    ]);
                }
             
                $entityManager->persist($user);
                $entityManager->flush();
                $user->removeFile(); // Delete the object file after persist to avoid serialize errors
                $this ->addFlash('success', 'User informations successfully edited');

                return $this->redirectToRoute('home');
            }

            return $this->render('user/editUser.html.twig', [
                'user' => $user,
                'userForm' => $userForm->createView(),
            ]);
    } 
    
    /**
    * @Route("/edit/password/{id}", name="editPassword", methods= {"GET", "POST"})
    */
    public function editPassword(EntityManagerInterface $entityManager, Request $request, UserRepository $repo, $id, UserPasswordHasherInterface $hasher ): Response
    {
        $user = $repo->find($id);
        $userId = $user->getId();
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
            'userId' => $userId
        ]);
    }

    /**
    * @Route("/myArtworks/{id}", name="myArtworks", methods= {"GET", "POST"})
    */
    public function myArtworks( Scene1Repository $repoG1,  Scene2Repository $repoG2,SceneD1Repository $repoD1, SceneD2Repository $repoD2, $id) : Response
    {       

        $sceneG1 = $repoG1->findAll(); 
        $sceneG2 = $repoG2->findAll(); 

        $allScenesG = array_merge($sceneG1, $sceneG2);
        // sorting generatives artworks by creaton date
        usort($allScenesG, function($a, $b) {
            return ($b->getUpdatedAt() <=> $a->getUpdatedAt());
        });

        $sceneD1 = $repoD1->findAll();
        $sceneD2 = $repoD2->findAll();
        $allScenesD = array_merge($sceneD1, $sceneD2);

        usort($allScenesD, function($a, $b) {
            return ($b->getUpdatedAt() <=> $a->getUpdatedAt());
        });
        $data = [
            'scenesG' =>  $allScenesG,
            'sceneD' => $allScenesD,
        ];
        
        return $this->render('user/myArtworks.html.twig', [
            'artworks' => $data,
        ]);
    } 
     /**
    * @Route("/myArtworks/delete/{id}/{entity}", name="deleteArtwork", methods= {"GET", "POST"})
    */
    public function Delete(EntityManagerInterface $entityManager, Scene1Repository $repoG1, Scene2Repository $repoG2, SceneD1Repository $repoD1, SceneD2Repository $repoD2, $id, $entity): Response
    {

        $currentUser = $this->getUser();

        if($entity === 'Scene1'){
            $artwork = $repoG1-> find($id);

            // Check if actual user is link to this artwork
            if ($artwork->getUser()!== $currentUser) {
                throw new AccessDeniedHttpException('You are not allowed to delete this artwork.');
            }

            $userId = $artwork->getUser()->getId();   
        } elseif ($entity === 'SceneD1'){
            $artwork = $repoD1->find($id);

            if ($artwork->getUser()!== $currentUser) {
                throw new AccessDeniedHttpException('You are not allowed to delete this artwork.');
            }

            $userId = $artwork->getUser()->getId();
        } elseif ($entity === 'SceneD2'){
            $artwork = $repoD2->find($id);

            if ($artwork->getUser()!== $currentUser) {
                throw new AccessDeniedHttpException('You are not allowed to delete this artwork.');
            }

            $userId = $artwork->getUser()->getId();
        } elseif ($entity === 'Scene2'){
            $artwork = $repoG2->find($id);

            if ($artwork->getUser()!== $currentUser) {
                throw new AccessDeniedHttpException('You are not allowed to delete this artwork.');
            }

            $userId = $artwork->getUser()->getId();
        } else { 
            throw new NotFoundHttpException('Entity not found');
        }

        $entityManager->remove($artwork);
        $entityManager->flush();

        $this->addFlash('success', 'Artwork removed from gallery!'); 

    
        return $this->redirectToRoute('myArtworks', [
            'id' => $userId
        ]);
    }
      
    /**
    * @Route("/myArtworks/update/{id}/{entity}", name="editArtwork", methods= {"GET", "POST"})
    */
    public function Update(Request $request, EntityManagerInterface $entityManager, Scene1Repository $repoG1, Scene2Repository $repoG2,SceneD2Repository $repoD2, SceneD1Repository $repoD1, $id, $entity): Response
    {
        $currentUser = $this->getUser();

        if($entity === 'Scene1'){
            $artwork = $repoG1-> find($id);
            if ($artwork->getUser()!== $currentUser) {
                throw new AccessDeniedHttpException('You are not allowed to edit this artwork.');
            }
            $userId = $artwork->getUser()->getId();
            $form = $this->createForm(SaveArtworkG1Type::class, $artwork);
        } elseif ($entity === 'Scene2'){
            $artwork = $repoG2->find($id);
            if ($artwork->getUser()!== $currentUser) {
                throw new AccessDeniedHttpException('You are not allowed to edit this artwork.');
            }
            $userId = $artwork->getUser()->getId();
            $form = $this->createForm(SaveArtworkG2Type::class, $artwork);
        } elseif ($entity === 'SceneD1'){
            $artwork = $repoD1->find($id);
            if ($artwork->getUser()!== $currentUser) {
                throw new AccessDeniedHttpException('You are not allowed to edit this artwork.');
            }
            $userId = $artwork->getUser()->getId();
            $form = $this->createForm(SaveArtworkD1Type::class, $artwork);
        } elseif ($entity === 'SceneD2'){
            $artwork = $repoD2->find($id);
            if ($artwork->getUser()!== $currentUser) {
                throw new AccessDeniedHttpException('You are not allowed to edit this artwork.');
            }
            $userId = $artwork->getUser()->getId();
            $form = $this->createForm(SaveArtworkD2Type::class, $artwork);
        } else { 
            throw new NotFoundHttpException('Entity not found');
        }

        $form -> handleRequest($request);
        if ( $form->isSubmitted() && $form->isValid()){

            $entityManager->persist($artwork);
            $entityManager->flush();

            $this->addFlash('success', 'Artwork updated successfully'); 
          
            return $this->redirectToRoute('myArtworks', [
                'id' => $userId
            ]);
        }
        return $this->render('user/editArtwork.html.twig', [
            'userId' => $userId,
            'form' => $form->createView(),
            'artwork' => $artwork
        ]);
    }
    
    /**
    * @Route("/roleRequest", name="roleRequest", methods= {"GET", "POST"})
    */
    public function roleRequest( EntityManagerInterface $entityManager, Request $request): Response
    {   
         // Check if the current user has already sent a role request
        $existingRoleRequest = $entityManager->getRepository(ArtistRole::class)->findOneBy([
            'user' => $this->getUser(),
        ]);
        if ($existingRoleRequest) {
            // If the user has already sent a role request, redirect to the home page
            $this->addFlash('warning', "You have already sent a role request. We'll get back to you as soon as possible. 
            Contact us if you need any changes or clarifications.");
            return $this->redirectToRoute('home');
        };

        $roleRequest = new ArtistRole(); 
        $roleRequest->setUser($this->getUser());

        $form = $this->createForm(ArtistRoleType::class, $roleRequest); 
        $form -> handleRequest($request); 

        if ( $form->isSubmitted() && $form->isValid()){
            $entityManager->persist($roleRequest);
            $entityManager->flush();

            $this->addFlash('success', 'Role request sent'); 

            return $this->redirectToRoute('home');
        }
        return $this->render('admin/artistForm.html.twig', [
            'form' => $form->createView(),
        ]);
    }


}
