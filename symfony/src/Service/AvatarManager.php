<?php

namespace App\Service;

use App\Entity\User;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class AvatarManager
{
    private $avatarDir;
    private Filesystem $filesystem;

    public function __construct(string $projectDir, Filesystem $filesystem) 
    {
        $this->avatarDir = $projectDir . '/public/images/avatar/';
        $this->filesystem = $filesystem; 
    }

    /**
     * Updates the user's avatar.
     *
     * If the new avatar differs from the current one and the current avatar is not the default image,
     * the current file is deleted before assigning the new one.
     *
     * @param User $user
     * @param UploadedFile|null $newAvatarFile The uploaded file, or null if there is no new image.
     * @param string $defaultAvatar The default file name (optional)
     */
    public function updateAvatar(User $user, ?UploadedFile $newAvatarFile, string $defaultAvatar = 'no-profile.jpg') : void
    {
        $oldAvatar = $user->getImageName();

        if($newAvatarFile){
            $newAvatar = $newAvatarFile->getClientOriginalName();

            if ($newAvatar !== $oldAvatar) {
                // Check if the new avatar already exists in the directory
                if (!$this->filesystem->exists($this->avatarDir . $newAvatar)) {
                    // Delete the old avatar file
                    if ($oldAvatar && $oldAvatar !== $defaultAvatar && $this->filesystem->exists($this->avatarDir . $oldAvatar)) {
                        $this->filesystem->remove($this->avatarDir . $oldAvatar);
                    }
                }
                $user->setImageName($newAvatar);
            }
        }
    }
    
    /**
     * Delete the user's avatar.
     *
     * Delete the avatar file if it's not the default image
     *
     * @param User $user
     * @param string $defaultAvatar The default file name (optional)
     */
    public function deleteAvatar(User $user, string $defaultAvatar = 'no-profile.jpg')
    {
        $avatar = $user->getImageName();
        if ($avatar && $avatar !== $defaultAvatar) {
            $this->filesystem->remove($this->avatarDir . $avatar);
        }
    }
}