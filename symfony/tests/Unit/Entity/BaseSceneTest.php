<?php

namespace App\Tests\Unit\Entity;

use DateTimeImmutable;
use App\Entity\{
    BaseScene,
    CollectiveDrawing,
    Scene1,
    Scene2,
    SceneD1,
    SceneD2,
    User
};
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\File\File;

class BaseSceneTest extends TestCase
{
    /**
     * @dataProvider provideSceneEntities
     */
    public function testAddAndRemoveLike(BaseScene $scene): void
    {
        $user = new User();

        $this->assertFalse($scene->isLikedByUser($user));

        $scene->addLike($user);
        $this->assertTrue($scene->isLikedByUser($user));

        $scene->removeLike($user);
        $this->assertFalse($scene->isLikedByUser($user));
    }

    /**
     * @dataProvider provideSceneEntities
     */
    public function testSetImageFileUpdatesUpdatedAtInAllScenes(BaseScene $scene): void
    {
        $this->assertNull($scene->getUpdatedAt());

        $tmpPath = tempnam(sys_get_temp_dir(), 'test_upload');
        file_put_contents($tmpPath, 'fake image');
        $file = new File($tmpPath);
    
        $scene->setImageFile($file);
    
        $this->assertNotNull($scene->getUpdatedAt());
        $this->assertInstanceOf(DateTimeImmutable::class, $scene->getUpdatedAt());
    
        unlink($tmpPath);
    }

    public static function provideSceneEntities(): array
    {
        return [
            'Scene1'    => [new Scene1()],
            'Scene2'    => [new Scene2()],
            'SceneD1'   => [new SceneD1()],
            'SceneD2'   => [new SceneD2()],
            'Drawing'   => [new CollectiveDrawing()],
        ];
    }
}
