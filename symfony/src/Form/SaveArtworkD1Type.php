<?php

namespace App\Form;

use App\Entity\SceneD1;

class SaveArtworkD1Type extends BaseSaveArtworkType
{
    protected function getDataClass(): string
    {
        return SceneD1::class;
    }
}
