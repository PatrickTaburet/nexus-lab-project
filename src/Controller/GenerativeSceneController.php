<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Scene1;
use App\Repository\Scene1Repository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Vich\UploaderBundle\Handler\DownloadHandler;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

/**
 * @Route("")
 */
class GenerativeSceneController extends AbstractController
{
    /**
     * @Route("/sceneG1", name="sceneG1")
     */
    public function scene1(): Response
    {
        return $this->render('generative_scene/scene1.html.twig', [
            'controller_name' => 'GenerativeSceneController',
        ]);
    }   

     /**
     * @Route("/generative/newScene/{id}", name="newScene", methods= {"GET"}))
     */
    public function newScene(Scene1Repository $repo, SerializerInterface $serializer, $id): Response
    {
        $scene = $repo -> find($id); 

        // NORMALIZED + ENCODE METHOD :
        // //transform complex object in an associative array (only group sceneDataRecup to avoid infinite loop with the user entity)
        // $sceneNormalized = $normalizer->normalize($scene, null, ['groups'=> 'sceneDataRecup']);
        // // then encore into json format
        // $json = json_encode($sceneNormalized);

        // SERIALIZER METHOD :
        $json = $serializer->serialize($scene,'json',['groups'=> 'sceneDataRecup']);
            // Décoder le JSON en tableau associatif
        $sceneData = json_decode($json, true);
        return $this->render('generative_scene/newScene1.html.twig', [
            'scene' => $sceneData,
        ]);   
    }

    /**
    * @Route("/generative/sendData", name="send_data", methods={"POST"})
    */
    public function sendData(Request $request, Security $security, EntityManagerInterface $entityManager): Response
    {
        // var_dump($security->getUser()->getId());
        $color = $request->request->get('color');
        $saturation = $request->request->get('saturation');
        $opacity = $request->request->get('opacity');
        $weight = $request->request->get('weight');
        $numLine = $request->request->get('numLine');
        $velocity = $request->request->get('velocity');
        $noiseOctave = $request->request->get('noiseOctave');
        $noiseFalloff = $request->request->get('noiseFalloff');
        $userId = $request->request->get('userId');
        $imgFile = $request->request->get('file');
        
        // Decode the base64 string and save it as a .png file
        $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $imgFile));

    
        // Créer un fichier temporaire à partir des données image
        $tempFile = tmpfile();

        // Écrire les données image dans le fichier temporaire
        fwrite($tempFile, $imageData);
        // Obtenir le chemin absolu du fichier temporaire
        $tempFilePath = stream_get_meta_data($tempFile)['uri'];
         // Get the image name
         $imageName = pathinfo($tempFilePath, PATHINFO_FILENAME) . '.png';
        // Créer un nouvel objet UploadedFile
        $imageFile = new UploadedFile($tempFilePath,  $imageName, 'image/png', null, true);
        
        // // Créer un objet Image
        // $image = new Scene1();

        // Get logged user
        // $userId = $security->getUser()->getId();
        // $user = $security->getUser();
        // $userId = $user->getId;
        // var_dump($userId );
            $user = $this->getDoctrine()
            ->getRepository(User::class)
            ->find($userId);
        
        if ($color !== null &&
            $weight !== null &&
            $numLine !== null &&
            $saturation !== null &&
            $opacity !== null &&
            $velocity !== null &&
            $noiseOctave !== null &&
            $noiseFalloff !== null &&
            $userId  !== null
            ) {
            $data = new Scene1;
            $data ->setColor($color);
            $data ->setWeight($weight);
            $data ->setNumLine($numLine);
            $data ->setSaturation($saturation);
            $data ->setOpacity($opacity);
            $data ->setVelocity($velocity);
            $data ->setNoiseOctave($noiseOctave);
            $data ->setNoiseFalloff($noiseFalloff);
            $data ->setUser($user);
                // Lier l'image au fichier uploadé
            $data->setImageFile($imageFile);

            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($data);
            $entityManager->flush();

              // Supprimer le fichier temporaire
            fclose($tempFile);
            return new Response('Data successfully saved!', Response::HTTP_OK);
            // redirection managed in javascript
        } 
            return new Response('Error: Missing data!', Response::HTTP_BAD_REQUEST);
        
    }

}
