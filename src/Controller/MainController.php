<?php

namespace App\Controller;

use App\Repository\Scene1Repository;
use App\Repository\SceneD1Repository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
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
     * @Route("/gallery", name="gallery")
     */
    public function gallery(Scene1Repository $repo, SceneD1Repository $repo2): Response
    {
        $scenes = $repo -> findAll(); 
        $scenes2= $repo2 -> findAll();
        return $this->render('main/gallery.html.twig', [
            'scenes' => $scenes,
            'scenes2'=>$scenes2
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
