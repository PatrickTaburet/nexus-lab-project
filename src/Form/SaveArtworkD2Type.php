<?php

namespace App\Form;

use App\Entity\SceneD2;

class SaveArtworkD2Type extends SaveArtworkBaseType
{
    protected function getDataClass(): string
    {
        return SceneD2::class;
    }
}
