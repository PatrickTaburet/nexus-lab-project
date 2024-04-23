<?php

namespace App\Controller;

use App\Repository\Scene1Repository;
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
    public function gallery(Scene1Repository $repo): Response
    {
        $scenes = $repo -> findAll(); 
        return $this->render('main/gallery.html.twig', [
            'scenes' => $scenes,
        ]);   
    }
}
