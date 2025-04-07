<?php

namespace App\Tests\Traits;
use Symfony\Component\HttpFoundation\File\UploadedFile;

trait FormFileHelperTrait
{
    protected function createTempCodeFile(string $content = 'test script'): UploadedFile
    {
        $filePath = tempnam(sys_get_temp_dir(), 'code');
        file_put_contents($filePath, $content);

        return new UploadedFile($filePath, 'test.txt', 'text/plain', null, true);
    }

    protected function createTempImageFile(): UploadedFile
    {
        $tempPath = tempnam(sys_get_temp_dir(), 'img');
        copy(__DIR__ . '/../Fixtures/test-image.jpg', $tempPath);

        return new UploadedFile($tempPath, 'test-image.jpg', 'image/jpeg', null, true);
    }

    protected function cleanupTempFile(string $filePath): void
    {
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }

    protected function deleteTmpImages(string $uploadDirectory): void
    {
        $projectDir = self::getContainer()->getParameter('kernel.project_dir');
        $imageUploadDir = $projectDir . '/public/images/' . $uploadDirectory;

        if (is_dir($imageUploadDir)) {
            $imageFiles = glob($imageUploadDir . '/*.tmp');
            foreach ($imageFiles as $tmpFile) {
                if (is_file($tmpFile)) {
                    unlink($tmpFile);
                }
            }
        }
    }
}
