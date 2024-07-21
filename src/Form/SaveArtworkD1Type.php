<?php

namespace App\Form;

use App\Entity\SceneD1;

class SaveArtworkD1Type extends SaveArtworkBaseType
{
    protected function getDataClass(): string
    {
        return SceneD1::class;
    }
}
