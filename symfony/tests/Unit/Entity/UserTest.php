<?php

namespace App\Tests\Unit\Entity;

use App\Entity\AddScene;
use App\Entity\CollectiveDrawing;
use App\Entity\Scene1;
use App\Entity\Scene2;
use App\Entity\SceneD1;
use App\Entity\SceneD2;
use App\Entity\User;
use Doctrine\Common\Collections\Collection;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\File\File;

class UserTest extends TestCase
{
    public function testConstructorInitializesProperties(): void
    {
        $user = new User();
        $this->assertInstanceOf(\DateTimeImmutable::class, $user->getCreatedAt());
        $this->assertEquals('no-profile.jpg', $user->getImageName());
        $this->assertNull($user->getImageFile());
        $this->assertInstanceOf(Collection::class, $user->getScene1());
        $this->assertInstanceOf(Collection::class, $user->getScene2());
        $this->assertInstanceOf(Collection::class, $user->getSceneD1());
        $this->assertInstanceOf(Collection::class, $user->getSceneD2());
        $this->assertInstanceOf(Collection::class, $user->getAddScene());
        $this->assertInstanceOf(Collection::class, $user->getCollectiveDrawing());
    }

    public function testUserIdentifier(): void
    {
        $user = new User();
        $email = 'test@example.com';
        $user->setEmail($email);

        $this->assertEquals($email, $user->getUserIdentifier());
    }

    public function testRolesAlwaysIncludeRoleUser(): void
    {
        $user = new User();

        // When no role is defined, ROLE_USER must always be present
        $user->setRoles([]);
        $this->assertContains('ROLE_USER', $user->getRoles());

        // When defining other roles, ROLE_USER should be added automatically
        $user->setRoles(['ROLE_ADMIN']);
        $this->assertContains('ROLE_ADMIN', $user->getRoles());
        $this->assertContains('ROLE_USER', $user->getRoles());
    }

    public function testSetImageFileAndUpdatedAt(): void
    {
        $user = new User();
        $this->assertNull($user->getUpdatedAt());

        // Create a temporary file to simulate an upload
        $tempFilePath = tempnam(sys_get_temp_dir(), 'test_upload');
        file_put_contents($tempFilePath, 'fake image');
        $file = new File($tempFilePath);

        $user->setImageFile($file);
        $this->assertNotNull($user->getUpdatedAt());

        unlink($tempFilePath); // clear temporary file
    }

    public function testRemoveFileRemovesCustomImage(): void
    {
        $user = new User();

        $tmpPath = tempnam(sys_get_temp_dir(), 'test_upload');
        file_put_contents($tmpPath, 'fake image');
        $file = new File($tmpPath);

        $user->setImageFile($file);
        $user->setImageName('custom-image.jpg');

        $this->assertNotNull($user->getImageFile());

        $user->removeFile();

        $this->assertNull($user->getImageFile());
        $this->assertEquals($user->getImageName(), 'no-profile.jpg');
        unlink($tmpPath);
    }

    public function testScene1Relation(): void
    {
        $this->assertBidirectionalRelationWorks(
            new User(),
            'getScene1',
            'addScene1',
            'removeScene1',
            Scene1::class
        );
    }
    public function testScene2Relation(): void
    {
        $this->assertBidirectionalRelationWorks(
            new User(),
            'getScene2',
            'addScene2',
            'removeScene2',
            Scene2::class
        );
    }
    public function testSceneD1Relation(): void
    {
        $this->assertBidirectionalRelationWorks(
            new User(),
            'getSceneD1',
            'addSceneD1',
            'removeSceneD1',
            SceneD1::class
        );
    }
    public function testSceneD2Relation(): void
    {
        $this->assertBidirectionalRelationWorks(
            new User(),
            'getSceneD2',
            'addSceneD2',
            'removeSceneD2',
            SceneD2::class
        );
    }
    public function testCollectiveDrawingRelation(): void
    {
        $this->assertBidirectionalRelationWorks(
            new User(),
            'getCollectiveDrawing',
            'addCollectiveDrawing',
            'removeCollectiveDrawing',
            CollectiveDrawing::class
        );
    }
    public function testAddSceneRelation(): void
    {
        $this->assertBidirectionalRelationWorks(
            new User(),
            'getAddScene',
            'addAddScene',
            'removeAddScene',
            AddScene::class
        );
    }
    
    private function assertBidirectionalRelationWorks(User $user, string $getter, string $adder, string $remover, string $entityClass): void
    {
        // Create a mock of Scene to test the relationship logic
        
        /** @var object&\PHPUnit\Framework\MockObject\MockObject $scene1 */
        $scene = $this->getMockBuilder($entityClass)
            ->disableOriginalConstructor()
            ->onlyMethods(['setUser', 'getUser'])
            ->getMock();
    
        // Expect setUser() to be called when adding the scene
        $scene->expects($this->exactly(2))
        ->method('setUser')
        ->withConsecutive([$user], [null]);

        // When removing the scene, simulate that the scene belongs to this user
        $scene->method('getUser')->willReturn($user);

        // Add the scene to the user
        $user->$adder($scene);
        $this->assertTrue($user->$getter()->contains($scene));

        // Remove the scene from the user
        $user->$remover($scene);
        $this->assertFalse($user->$getter()->contains($scene));
    }
    
}
