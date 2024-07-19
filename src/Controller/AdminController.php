<?php

namespace App\Controller;

use App\Form\{
    EditUserType,
    SaveArtworkD1Type,
    SaveArtworkD2Type,
    SaveArtworkG1Type,
    SaveArtworkG2Type,
};
use App\Repository\{
    UserRepository,
    Scene1Repository,
    Scene2Repository,
    SceneD1Repository,
    SceneD2Repository,
    AddSceneRepository,
    ArtistRoleRepository
};
use Symfony\Component\ {
    HttpFoundation\Request,
    HttpFoundation\Response,
    Routing\Annotation\Route,
    HttpKernel\Exception\NotFoundHttpException
};
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Doctrine\ORM\EntityManagerInterface;
use Knp\Component\Pager\PaginatorInterface;


/**
 * @Route("/admin", name="admin_")
 */
class AdminController extends AbstractController
{
     /**
    * @Route("/dashboard", name="dashboard")
    */
    public function dashboard(ArtistRoleRepository $role, AddSceneRepository $newScene): Response
    {
        $roleRequests = $role->findAll();
        $sceneRequests = $newScene->findAll();

        // Sorting all requests by creation date
        usort($roleRequests, function($a, $b) {
            return ($b->getCreatedAt() <=> $a->getCreatedAt());
        });
        usort($sceneRequests, function($a, $b) {
            return ($b->getUpdatedAt() <=> $a->getUpdatedAt());
        });

        return $this->render('admin/dashboard.html.twig', [
           'roleRequests' => $roleRequests,
           'sceneRequests' => $sceneRequests
        ]);
    }

    // Users manager dashboard

     /**
    * @Route("/users", name="users")
    */
    public function usersList(UserRepository $users, PaginatorInterface $paginator, Request $request): Response
    {
        // IMPLEMENTER LA LOGIQUE DE TRI (en fonction des like) ET DE PAGINATION
        $data = $users->findAll();
        $allUsers = $paginator->paginate(
            $data,
            $request->query->getInt('page', 1),
            9
        );
        return $this->render('admin/users.html.twig', [
            'users' => $allUsers
        ]);
    }
    /**
    * @Route("/users/edit/{id}", name="edit_user", methods= {"GET", "POST"})
    */
    public function editUser(Request $request, UserRepository $repo, EntityManagerInterface $entityManager, $id) : Response
    {       
            $user = $repo->find($id);
            $oldAvatar = $user->getImageName();
           
            $userForm = $this->createForm(EditUserType::class, $user,[
                'is_admin' => true,  
            ]);
            $userForm -> handleRequest($request);

            if ($userForm->isSubmitted() && $userForm->isValid()) {

            // Check if the new avatar is different from the old one and from the default image
                $formData = $userForm->getData();
                $newAvatarFile = $formData->getImageFile();
                if($newAvatarFile){
                    $newAvatar = $newAvatarFile->getClientOriginalName();
                    if ($newAvatar !== $oldAvatar) {
                        // Check if the new avatar already exists in the directory
                        $avatarDir = $this->getParameter('kernel.project_dir') . '/public/images/avatar/';
                        if (!file_exists($avatarDir . $newAvatar)) {
                            // Delete the old avatar file
                            if ($oldAvatar && $oldAvatar !== 'no-profile.jpg') {
                                unlink($avatarDir . $oldAvatar);
                            }
                        }
                    }
                }
     
                $entityManager -> persist($user);
                $entityManager -> flush();
                $userEmail = $user->getEmail();
                $user->removeFile(); // Delete the object file after persist to avoid errors
                $this ->addFlash('success', 'User '.$userEmail.' edit succeed');

                return $this->redirectToRoute('admin_users');
            }

            return $this->render('user/editUser.html.twig', [
                'user' => $user,
                'userForm' => $userForm->createView(),
                'isAdmin' => false,
            ]);
    } 

      /**
     * @Route("/users/delete/{id}", name="delete_user", methods= {"GET"})
     */
    public function deleteUser(UserRepository $repo, EntityManagerInterface $entityManager, $id): Response
    {
        $user = $repo->find($id);
        
        // Delete the avatar file if it's not the default image
        $avatar = $user->getImageName();
        if ($avatar && $avatar !== 'no-profile.jpg') {
            unlink($this->getParameter('kernel.project_dir') . '/public/images/avatar/' . $avatar);
        }
        $entityManager->remove($user);
        $entityManager->flush();
        $userEmail = $user->getEmail();
        $this->addFlash('success', 'User '.$userEmail.' delete succeed');
        return $this->redirectToRoute('admin_users');
    }

      /**
     * @Route("/confirm/{id}", name="confirm")
     */
    public function confirmDelete(UserRepository $users,  $id): Response
    {
        return $this->render('admin/confirm.html.twig', [
            'user' => $users->find($id)
        ]);
    }

    // Gallery manager dashboard
    
    /**
     * @Route("/gallery", name="gallery")
     */
    public function gallery(Scene1Repository $repoG1, Scene2Repository $repoG2, SceneD1Repository $repoD1, SceneD2Repository $repoD2, PaginatorInterface $paginator, Request $request): Response
    {
        $scenes = $repoG1 -> findAll(); 
        $scenes2= $repoD1 -> findAll();
        $scenes3= $repoG2 -> findAll();
        $scenes4= $repoD2 -> findAll();
        $allScenes = array_merge($scenes, $scenes2, $scenes3, $scenes4);
        usort($allScenes, function($a, $b) {
            return ($b->getUpdatedAt() <=> $a->getUpdatedAt());
        });
        $artworks = $paginator->paginate(
            $allScenes,
            $request->query->getInt('page', 1),
            9
        );
        return $this->render('admin/artworks.html.twig', [
            'artworks' => $artworks
        ]);   
    }
    
      /**
     * @Route("/gallery/delete/{id}/{entity}", name="delete_artwork", methods= {"GET", "POST"})
     */
    public function deleteArtwork(Scene1Repository $repoG1, Scene2Repository $repoG2, SceneD1Repository $repoD1, SceneD2Repository $repoD2,EntityManagerInterface $entityManager, $id, $entity): Response
    {
        if($entity === 'Scene1'){
            $artwork = $repoG1-> find($id);
            $entityManager->remove($artwork);
           
        } elseif ($entity === 'SceneD1'){
            $artwork = $repoD1->find($id);
            $entityManager->remove($artwork);
        } elseif ($entity === 'SceneD2'){
            $artwork = $repoD2->find($id);
            $entityManager->remove($artwork);
        } elseif ($entity === 'Scene2'){
            $artwork = $repoG2->find($id);
            $entityManager->remove($artwork);
        } else { 
            throw new NotFoundHttpException('Entity not found');
        }
        $artworkTitle = $artwork->getTitle();

        $entityManager->flush();

        $this->addFlash('success', 'Artwork '.$artworkTitle.' delete succeed');
        return $this->redirectToRoute('admin_gallery');
    }
    /**
    * @Route("/gallery/edit/{id}/{entity}", name="edit_artwork", methods= {"GET", "POST"})
    */
    public function editArtwork(Request $request, Scene1Repository $repoG1, Scene2Repository $repoG2, SceneD1Repository $repoD1, SceneD2Repository $repoD2, EntityManagerInterface $entityManager, $id, $entity) : Response
    {       
        
        if($entity === 'Scene1'){
            $artwork = $repoG1-> find($id);
            $userId = $artwork->getUser()->getId();   
            $form = $this->createForm(SaveArtworkG1Type::class, $artwork);
        } elseif ($entity === 'SceneD1'){
            $artwork = $repoD1->find($id);
            $userId = $artwork->getUser()->getId();   
            $form = $this->createForm(SaveArtworkD1Type::class, $artwork);
        } elseif ($entity === 'SceneD2'){
            $artwork = $repoD2->find($id);
            $userId = $artwork->getUser()->getId();   
            $form = $this->createForm(SaveArtworkD2Type::class, $artwork);
        } elseif ($entity === 'Scene2'){
            $artwork = $repoG2->find($id);
            $userId = $artwork->getUser()->getId();   
            $form = $this->createForm(SaveArtworkG2Type::class, $artwork);

        } else { 
            throw new NotFoundHttpException('Entity not found');
        }
            
            $form -> handleRequest($request);

            if ($form->isSubmitted() && $form->isValid()) {

                $entityManager -> persist($artwork);
                $entityManager -> flush();
                $artworkTitle = $artwork->getTitle();
                $this ->addFlash('success', 'Artwork '.$artworkTitle.' edit succeed');

                return $this->redirectToRoute('admin_gallery');
            }

            return $this->render('user/editArtwork.html.twig', [
                'artwork' => $artwork,
                'form' => $form->createView(),
                'userId' => $userId
            ]);
    } 

    /**
    * @Route("/request/{entity}/{id}", name="show_request", methods= {"GET", "POST"})
    */
    public function showRequest(ArtistRoleRepository $artistReq, AddSceneRepository $sceneReq, $id, $entity): Response
    {
        $request = null;
        $type = '';
        if($entity === 'ArtistRole'){
            $request = $artistReq->find($id);
            $type = $request->getType();
        }
        if($entity === 'AddScene'){
            $request = $sceneReq->find($id);
            $type = $request->getType();
        }
       

        return $this->render('admin/request.html.twig', [
           'request' => $request,
           'type' => $type,
        ]);
    }

    /**
    * @Route("/delete/request/{entity}/{id}", name="delete_request", methods= {"GET", "POST"})
    */
    public function deleteRequest(EntityManagerInterface $entityManager, ArtistRoleRepository $artistReq, AddSceneRepository $sceneReq, $id, $entity): Response
    {
        if($entity === 'ArtistRole'){
            $request = $artistReq->find($id);
            $entityManager->remove($request);
        }
        if($entity === 'AddScene'){
            $request = $sceneReq->find($id);
            $entityManager->remove($request);
        }
        $entityManager->flush();
        $this->addFlash('success', 'Request successfully deleted');
        return $this->redirectToRoute('admin_dashboard');
    }

   




}
