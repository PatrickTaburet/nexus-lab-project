<?php

namespace App\Controller;

use App\Form\SortArtworkType;
use App\Repository\{
    CollectiveDrawingRepository,
    Scene1Repository,
    Scene2Repository,
    SceneD1Repository,
    SceneD2Repository,
};
use Symfony\Component\{
    HttpFoundation\Response,
    Routing\Annotation\Route,
    HttpFoundation\Request,
};
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class MainController extends AbstractController
{
    #[Route("/", name: "home")]
    public function index(): Response
    {
        return $this->render('main/home.html.twig', [
            'controller_name' => 'MainController',
        ]);
    }

    #[Route("/gallery", name: "gallery", methods: ["GET", "POST"])]
    public function gallery(Request $request, Scene1Repository $repo, SceneD1Repository $repo2, Scene2Repository $repo3, SceneD2Repository $repo4, CollectiveDrawingRepository $repo5, PaginatorInterface $paginator): Response
    {
        $session = $request->getSession();
        $scenesG1 = $repo -> findAll(); 
        $scenesD1 = $repo2 -> findAll();
        $scenesG2 = $repo3 -> findAll();
        $scenesD2 = $repo4 -> findAll();
        $collectiveDrawing = $repo5 -> findAll();
        $allScenes = array_merge($scenesG1, $scenesD1, $scenesG2, $scenesD2, $collectiveDrawing);

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
    
    #[Route("/create", name: "create")]
    public function create(): Response
    {
        return $this->render('main/create.html.twig', [
        ]);   
    }

    #[Route("/create/generative-art", name: "generativeHome")]
    public function generativeHome(): Response
    {
        return $this->render('main/generativeHome.html.twig', [
        ]);   
    }

    #[Route("/create/data-art", name: "dataArtHome")]
    public function dataArtHome(): Response
    {
        return $this->render('main/dataArtHome.html.twig', [
        ]);
    }

    #[Route("/create/collective-drawing", name: "collectiveDrawing")]
    public function collectiveDrawing(): Response
    {
        return $this->render('collective_drawing/collectiveDrawing.html.twig', [
        ]);   
    }

    #[Route("/privacy-policy", name: "privacyPolicy")]
    public function privacyPolicy(): Response
    {
        return $this->render('main/privacyPolicy.html.twig', [
        ]);   
    }

    #[Route("/community", name: "community")]
    public function community(): Response
    {
        return $this->render('main/community.html.twig', [  
        ]);   
    }

    #[Route("/contact", name: "contact")]
    public function contact(): Response
    {
        return $this->render('main/contact.html.twig', [  
        ]);   
    }

}
