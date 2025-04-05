<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\File\UploadedFile;

class CodeFileUploader
{
    private string $targetDirectory;

    public function __construct(string $codeDirectory)
    {
        $this->targetDirectory = $codeDirectory;
    }

    public function upload(UploadedFile $file): string
    {
        // Extract the file name and extension
        $fileName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $extension = $file->guessExtension();
        // Generate a unique file name
        $uniqueFileName = $fileName . uniqid() . '.' . $extension;

        $file->move($this->targetDirectory, $uniqueFileName);

        return $uniqueFileName;
    }
}
