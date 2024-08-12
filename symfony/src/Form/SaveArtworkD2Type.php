<?php

namespace App\Form;

use App\Entity\SceneD2;

class SaveArtworkD2Type extends BaseSaveArtworkType
{
    protected function getDataClass(): string
    {
        return SceneD2::class;
    }
}
