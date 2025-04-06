<?php

namespace App\Tests\Functional\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class ArtistControllerTest extends WebTestCase
{

    private User $user;
    private $client;

    protected function setUp(): void
    {
        parent::setUp();
    
        $this->client = static::createClient();
        $container = $this->client->getContainer();
        $em = $container->get('doctrine')->getManager();
        $repo = $em->getRepository(User::class);
        
        $user = new User();
        $user->setEmail('artist@test.com');
        $user->setPseudo('artist_user');
        $user->setPassword('hashed-password');
        $user->setRoles(['ROLE_ARTIST']);
    
        $em->persist($user);
        $em->flush();
    
        $this->user = $repo->findOneBy(['email' => 'artist@test.com']);
    }
    

    public function testAddSceneFormAccess(): void
    {
        $this->client->loginUser($this->user);

        $this->client->request('GET', '/artist/add-new-scene/1');
        $this->assertResponseIsSuccessful();
        $this->assertSelectorExists('form');
        $this->assertSelectorTextContains('h1', 'Add new Scene');
    }
    
    public function testSubmitValidAddSceneForm(): void
    {
        $this->client->loginUser($this->user);

        $crawler = $this->client->request('GET', '/artist/add-new-scene/1');
        $form = $crawler->selectButton('Submit')->form();

        $filePath = tempnam(sys_get_temp_dir(), 'code');
        file_put_contents($filePath, 'echo "hello";');

        $form['add_scene[title]'] = 'Test Scene';
        $form['add_scene[description]'] = 'Test description';
        $form['add_scene[language][0]']->tick();
        $form['add_scene[codeFile]']->upload(new UploadedFile($filePath, 'test.txt', 'text/plain', null, true));
        $imagePath = tempnam(sys_get_temp_dir(), 'img');
        copy(__DIR__.'/../../Fixtures/test-image.jpg', $imagePath); 
        $form['add_scene[imageFile][file]']->upload(new UploadedFile(
            $imagePath,
            'test-image.jpg',
            'image/jpeg',
            null,
            true
        ));
        $this->client->submit($form);

        unlink($filePath);
        sleep(1); 
        $uploadDir = __DIR__ . '/../../../public/code/';
        do {
            $files = glob($uploadDir . '*');
            usleep(100000);
        } while (empty($files));
        
        $latestFile = end($files);
        unlink($latestFile);

        $this->assertResponseRedirects('/');
        $this->client->followRedirect();
        $this->assertSelectorExists('.flash-success');
    }

    public function testSubmitInvalidAddSceneForm(): void
    {
        $this->client->loginUser($this->user);
        $crawler = $this->client->request('GET', '/artist/add-new-scene/1');
        $form = $crawler->selectButton('Submit')->form();
    
        // Invalid completion 
        $form['add_scene[title]'] = '';
        $form['add_scene[description]'] = 'test description';
        $tempFile = tempnam(sys_get_temp_dir(), 'upl');
        file_put_contents($tempFile, 'dummy content');
        $uploadedFile = new UploadedFile($tempFile, 'dummy.txt', 'text/plain', null, true);
        
        $form['add_scene[codeFile]'] = $uploadedFile;

        $this->client->submit($form);

        // $this->assertSelectorExists('form');
        $this->assertResponseStatusCodeSame(200);
    }

    protected function tearDown(): void
    {
        $em = static::getContainer()->get('doctrine')->getManager();
        $em->createQuery('DELETE FROM App\Entity\AddScene')->execute();
        $em->createQuery('DELETE FROM App\Entity\User')->execute();

        $em->clear();
    
        parent::tearDown();
    }
}
