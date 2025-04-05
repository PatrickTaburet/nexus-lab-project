<?php

namespace App\Tests\App\tests\Integration\Entity;

use App\Entity\RefreshToken;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class RefreshTokenTest extends KernelTestCase
{
    public function testRefreshTokenPersistence(): void
    {
        self::bootKernel();
        $em = self::getContainer()->get('doctrine')->getManager();

        $token = new RefreshToken('test_refresh_token', 'test_username');

        $em->persist($token);
        $em->flush();
        $em->clear();

        $repo = $em->getRepository(RefreshToken::class);
        $savedToken = $repo->findOneBy(['refresh_token' => 'test_refresh_token']);

        $this->assertNotNull($savedToken);
        $this->assertSame('test_username', $savedToken->getUsername());
        $this->assertSame('test_refresh_token', $savedToken->getRefreshToken());
        $this->assertTrue($savedToken->isValid());
        $this->assertInstanceOf(\DateTimeImmutable::class, $savedToken->getValid());

    }

    protected function tearDown(): void
    {
        parent::tearDown();

        $em = self::getContainer()->get('doctrine')->getManager();
        $em->createQuery('DELETE FROM App\Entity\RefreshToken')->execute();
        $em->clear();
    }
}
