<?php

namespace App\Controller;

use App\Form\EditUserType;
use App\Form\SaveArtworkD1Type;
use App\Form\SaveArtworkG1Type;
use Doctrine\ORM\EntityManager;
use App\Repository\UserRepository;
use App\Repository\Scene1Repository;
use App\Repository\SceneD1Repository;
use Doctrine\ORM\EntityManagerInterface;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * @Route("/admin", name="admin_")
 */
class AdminController extends AbstractController
{
     /**
    * @Route("/dashboard", name="dashboard")
    */
    public function dashboard(UserRepository $users, Request $request): Response
    {
    
        return $this->render('admin/dashboard.html.twig', [
           
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
            
            $userForm = $this->createForm(EditUserType::class, $user,[
                'is_admin' => true,
                'is_not_admin' => false,
                
            ]);
            $userForm -> handleRequest($request);

            if ($userForm->isSubmitted() && $userForm->isValid()) {

                  // Handle the uploaded avatar image       
                // $avatar = $user->getAvatar();
                // $user->setAvatar($avatar);
                // $entityManager = $this->getDoctrine()
                //                       ->getManager();
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
    public function gallery(Scene1Repository $repo, SceneD1Repository $repo2, PaginatorInterface $paginator, Request $request): Response
    {
        $scenes = $repo -> findAll(); 
        $scenes2= $repo2 -> findAll();
        $allScenes = array_merge($scenes, $scenes2);
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
    public function deleteArtwork(Scene1Repository $repoG1, SceneD1Repository $repoD1, EntityManagerInterface $entityManager, $id, $entity): Response
    {
        if($entity === 'Scene1'){
            $artwork = $repoG1-> find($id);
            $entityManager->remove($artwork);
           
        } elseif ($entity === 'SceneD1'){
            $artwork = $repoD1->find($id);
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
    public function editArtwork(Request $request, Scene1Repository $repoG1, SceneD1Repository $repoD1, EntityManagerInterface $entityManager, $id, $entity) : Response
    {       
        
        if($entity === 'Scene1'){
            $artwork = $repoG1-> find($id);
            $form = $this->createForm(SaveArtworkG1Type::class, $artwork);

        } elseif ($entity === 'SceneD1'){
            $artwork = $repoD1->find($id);
            $form = $this->createForm(SaveArtworkD1Type::class, $artwork);

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
            ]);
    } 
}
