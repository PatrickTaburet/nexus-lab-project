<?php

namespace App\Controller;

use App\Form\SortArtworkType;
use App\Repository\Scene1Repository;
use App\Repository\SceneD1Repository;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class MainController extends AbstractController
{
    /**
     * @Route("/", name="home")
     */
    public function index(): Response
    {
        return $this->render('main/home.html.twig', [
            'controller_name' => 'MainController',
        ]);
    }
     /**
     * @Route("/gallery", name="gallery", methods= {"GET", "POST"})
     */
    public function gallery(Request $request, Scene1Repository $repo, PaginatorInterface $paginator, SceneD1Repository $repo2): Response
    {
        $session = $request->getSession();
        $sceneG1 = $repo -> findAll(); 
        $scenesD1= $repo2 -> findAll();
        $allScenes = array_merge($sceneG1, $scenesD1);

        $form = $this->createForm(SortArtworkType::class);
        $form->handleRequest($request);

        // Sort artworks according to the choice of the form (date or likes)
        if ($form->isSubmitted() && $form->isValid()) { 

            $sort = $form->get('sortSelect')->getData();
            $session->set('sort_option', $sort);

            if ($sort == 'likes') {
                usort($allScenes, function($a, $b) {
                    return ($b->getLikes()->count() <=> $a->getLikes()->count());
                });
            } elseif ($sort == 'date') {
                usort($allScenes, function($a, $b) {
                    return ($b->getUpdatedAt() <=> $a->getUpdatedAt());
                });
            }   
        } else {
            // Sort artworks based on the previous sort option stored in the session, otherwise sorted by date by default
            $sortOption = $session->get('sort_option', 'date');
            if ($sortOption == 'likes') {
                usort($allScenes, function ($a, $b) {
                    return ($b->getLikes()->count() <=> $a->getLikes()->count());
                });
            } else {
                usort($allScenes, function ($a, $b) {
                    return ($b->getUpdatedAt() <=> $a->getUpdatedAt());
                });
            }
        }

        $scenes = $paginator->paginate(
            $allScenes,
            $request->query->getInt('page', 1), /*page number*/
            15 /*limit per page*/
        );

        return $this->render('main/gallery.html.twig', [
            'scenes' => $scenes,
            'form' => $form->createView(),
        ]);   
    }
    
    /**
    * @Route("/create", name="create")
    */
    public function create(): Response
    {
        return $this->render('main/create.html.twig', [
        ]);   
    }
    /**
    * @Route("/create/generative-art", name="generativeHome")
    */
    public function generativeHome(): Response
    {
        return $this->render('main/generativeHome.html.twig', [
        ]);   
    }
    /**
    * @Route("/create/data-art", name="dataArtHome")
    */
    public function dataArtHome(): Response
    {
        return $this->render('main/dataArtHome.html.twig', [
        ]);   
    }

}
