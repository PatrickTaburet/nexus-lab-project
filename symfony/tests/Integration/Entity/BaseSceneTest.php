<?php

namespace App\Tests\Integration\Entity;

use App\Entity\{
    BaseScene,
    CollectiveDrawing,
    Scene1,
    Scene2,
    SceneD1,
    SceneD2,
    User
};

use DateTimeImmutable;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class BaseSceneTest extends KernelTestCase
{

    // Fixtures 

    private User $user;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->user = $this->getValidUser();
    }

    private function getValidUser(): User
    {
        return (new User())
            ->setEmail(uniqid() . '@test.com')
            ->setPseudo(uniqid() . 'user')
            ->setRoles(['ROLE_USER'])
            ->setPassword('hashed-password');
    }
    
    private function getFakeFile() : UploadedFile
    {
        $filePath = tempnam(sys_get_temp_dir(), 'test_upload');
        file_put_contents($filePath, 'fake content');

        return new UploadedFile(
            $filePath,
            'test.jpg',
            'image/jpeg',
            null,
            true // test mode: skip file upload checks
        );
    }
    
    // Validation Helper

    private function assertHasErrors(BaseScene $entity, int $expectedErrorCount = 0): void
    {
        self::bootKernel();
        $container = static::getContainer();
        $errors = $container->get('validator')->validate($entity);
        if (count($errors) !== $expectedErrorCount) {
            foreach ($errors as $error) {
                echo sprintf(
                    "\nViolation on property '%s': %s",
                    $error->getPropertyPath(),
                    $error->getMessage()
                );
            }
        }
    
        $this->assertCount($expectedErrorCount, $errors);
    }

    // Valid Cases

    public function testValidBaseSceneData(): void
    {
        $scene = (new Scene1())
            ->setTitle('Valid title')
            ->setComment('Valid comment')
            ->setUser($this->user);

        $this->assertHasErrors($scene, 0);
    }

    // Constraint Violations

    public function testTitleNotBlank(): void
    {
        $scene = (new Scene1())
            ->setTitle('')
            ->setComment('Comment')
            ->setUser($this->user);

        $this->assertHasErrors($scene, 1);
    }

    public function testCommentNotBlank(): void
    {
        $scene = (new Scene1())
            ->setTitle('Valid title')
            ->setComment('')
            ->setUser($this->user);

        $this->assertHasErrors($scene, 1);
    }

    public function testUserNotNull(): void
    {
        $scene = (new Scene1())
            ->setTitle('Title')
            ->setComment('Comment');
            // no ->setUser()

        $this->assertHasErrors($scene, 1);
    }

    public function testTooLongTitle(): void
    {
        $scene = (new Scene1())
            ->setTitle(str_repeat('a', 101)) // > 100 chars
            ->setComment('Comment')
            ->setUser($this->user);

        $this->assertHasErrors($scene, 1);
    }

    public function testTooLongComment(): void
    {
        $scene = (new Scene1())
            ->setTitle('Title')
            ->setComment(str_repeat('a', 256)) // > 255 chars
            ->setUser($this->user);
    
        $this->assertHasErrors($scene, 1);
    }

    // Doctrine Persistence 

    public function testScene1Persist(): void
    {
        $scene = (new Scene1())
            ->setTitle('Scene1')
            ->setComment('Scene1 Comment')
            ->setUser($this->user)
            ->setColor(100)
            ->setSaturation(80)
            ->setOpacity(0.9)
            ->setWeight(1.3)
            ->setNumLine(10)
            ->setVelocity(1.5)
            ->setNoiseOctave(2)
            ->setNoiseFalloff(6);

        $this->assertScenePersists($scene);
    }

    public function testScene2Persist(): void
    {
        $scene = (new Scene2())
            ->setTitle('Scene2')
            ->setComment('Scene2 Comment')
            ->setUser($this->user)
            ->setBrightness(5)
            ->setDeformB(0.2)
            ->setColorRange(2)
            ->setHue(180)
            ->setMovement(0.8)
            ->setDeformA(1.2)
            ->setShape(0.2)
            ->setRings(0.5)
            ->setDiameter(0.5)
            ->setZoom(0.5);

        $this->assertScenePersists($scene);
    }

    public function testSceneD1Persist(): void
    {
        $scene = (new SceneD1())
            ->setTitle('SceneD1')
            ->setComment('SceneD1 Comment')
            ->setUser($this->user)
            ->setRandomness(0.5)
            ->setLooping(false)
            ->setAbstract(false);

        $this->assertScenePersists($scene);
    }

    public function testSceneD2Persist(): void
    {
        $scene = (new SceneD2())
            ->setTitle('SceneD2')
            ->setComment('SceneD2 Comment')
            ->setUser($this->user)
            ->setDivFactor(3)
            ->setCopy(10)
            ->setDeformation(3)
            ->setSizeFactor(2.5)
            ->setAngle(5)
            ->setOpacity(0.7)
            ->setFilters(2)
            ->setDivision(5)
            ->setColorRange(2)
            ->setGlitch(2)
            ->setNoise(1)
            ->setColorsValue("blue");

        $this->assertScenePersists($scene);
    }

    public function testCollectiveDrawingPersist(): void
    {       
        $scene = (new CollectiveDrawing())
            ->setTitle('Drawing')
            ->setComment('Collaborative art')
            ->setUser($this->user)
            ->setData([123]);

        $scene->setImageFile($this->getFakeFile());
     
        $this->assertScenePersists($scene);
    }

    private function assertScenePersists(object $scene): void
    {
        $em = self::getContainer()->get('doctrine')->getManager();

        $em->persist($this->user);
        $em->persist($scene);
        $em->flush();
        $em->clear();

        $repo = $em->getRepository(get_class($scene));
        $saved = $repo->findOneBy(['title' => $scene->getTitle()]);

        $this->assertNotNull($saved);
        $this->assertEquals($scene->getComment(), $saved->getComment());
        $this->assertInstanceOf(User::class, $saved->getUser());
        $this->assertSame($scene->getUser()->getID(), $saved->getUser()->getID());
    }

    
    // Like System

    public function testSceneLikePersistenceAndRemoval(): void
    {
        $scene = (new Scene1())
        ->setTitle('Liked scene')
        ->setComment('Valid comment')
        ->setUser($this->user)
        ->setColor(100)
        ->setSaturation(80)
        ->setOpacity(0.9)
        ->setWeight(1.3)
        ->setNumLine(10)
        ->setVelocity(1.5)
        ->setNoiseOctave(2)
        ->setNoiseFalloff(6);

        $scene->addLike($this->user);
        
        $container = static::getContainer();
        $em = $container->get('doctrine')->getManager();
        $em->persist($this->user);
        $em->persist($scene);
        $em->flush($scene);
        $em->clear();

        $savedScene = $em->getRepository(Scene1::class)->findOneBy(['title' => 'Liked scene']);
        $savedUser = $em->getRepository(User::class)->findOneBy(['email' => $this->user->getEmail()]);

        $this->assertTrue($savedScene->isLikedByUser($savedUser));

        $savedScene->removeLike($savedUser);
        $this->assertFalse($savedScene->isLikedByUser($savedUser));
    }

    // Vich Uploader System

    public function testImageFileSetsImageNameAndUpdatedAt(): void
    {
        $scene = (new CollectiveDrawing())
            ->setTitle('With image')
            ->setComment('Scene with file')
            ->setUser($this->user)
            ->setData([123]);

        $scene->setImageFile($this->getFakeFile());

        $em = self::getContainer()->get('doctrine')->getManager();
        $em->persist($this->user);
        $em->persist($scene);
        $em->flush();
        $em->clear();

        $repo = $em->getRepository(CollectiveDrawing::class);
        $saved = $repo->findOneBy(['title' => 'With image']);

        $this->assertNotNull($saved->getImageName());
        $this->assertNotNull($saved->getUpdatedAt());
        $this->assertInstanceOf(DateTimeImmutable::class, $saved->getUpdatedAt());
    }
    
    protected function tearDown(): void
    {
        parent::tearDown();
        $em = self::getContainer()->get('doctrine')->getManager();

        $em->createQuery('DELETE FROM App\Entity\Scene1')->execute();
        $em->createQuery('DELETE FROM App\Entity\Scene2')->execute();
        $em->createQuery('DELETE FROM App\Entity\SceneD1')->execute();
        $em->createQuery('DELETE FROM App\Entity\SceneD2')->execute();
        $em->createQuery('DELETE FROM App\Entity\CollectiveDrawing')->execute();
        $em->createQuery('DELETE FROM App\Entity\User')->execute();
        $em->clear();
    }
}
