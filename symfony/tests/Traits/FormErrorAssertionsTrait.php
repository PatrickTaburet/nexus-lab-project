<?php

namespace App\Tests\Traits;

trait FormErrorAssertionsTrait
{
    public function assertFormErrorDisplayed(string $expectedMessage): void
    {
        $this->assertSelectorExists('.alert');
        $this->assertStringContainsString(
            $expectedMessage,
            $this->client->getResponse()->getContent()
        );
    }
}
