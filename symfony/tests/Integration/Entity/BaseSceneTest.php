<?php

namespace App\Tests\Integration\Entity;

use App\Entity\{
    CollectiveDrawing,
    Scene1,
    Scene2,
    SceneD1,
    SceneD2,
    User
};
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class BaseSceneTest extends KernelTestCase
{
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
        $filePath = tempnam(sys_get_temp_dir(), 'test_upload');
        file_put_contents($filePath, 'fake content');

        $scene = (new CollectiveDrawing())
            ->setTitle('Drawing')
            ->setComment('Collaborative art')
            ->setUser($this->user)
            ->setData([200])
            ->setImageFile(new UploadedFile($filePath, 'test.jpg', 'image/jpeg', null, true));

        var_dump($scene);
     
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
