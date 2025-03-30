<?php

namespace App\Tests\Unit\Entity;

use DateTimeImmutable;
use App\Entity\AddScene;
use App\Entity\User;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\File\File;

class AddSceneTest extends TestCase
{
    
    public function testUserRelationIsCorrectlyAssigned(): void
    {
        $addScene = new AddScene();
        $user = new User();
        $this->assertNull($addScene->getUser());
        $addScene->setUser($user);
        $this->assertSame($user, $addScene->getUser());
    }

    public function testSetImageFileUpdatesUpdatedAtInAllScenes(): void
    {
        $addScene = new AddScene();
        $this->assertNull($addScene->getUpdatedAt());

        $tmpPath = tempnam(sys_get_temp_dir(), 'test_upload');
        file_put_contents($tmpPath, 'fake image');
        $file = new File($tmpPath);
    
        $addScene->setImageFile($file);
    
        $this->assertNotNull($addScene->getUpdatedAt());
        $this->assertInstanceOf(DateTimeImmutable::class, $addScene->getUpdatedAt());
    
        unlink($tmpPath);
    }

    public function testGetTypeReturnsCorrectValue()
    {
        $addScene = new AddScene();
        $this->assertEquals('AddScene', $addScene->getType(), 'Expected getType() to return "AddScene"');
    }

}
