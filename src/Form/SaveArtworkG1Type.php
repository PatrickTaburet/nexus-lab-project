<?php

namespace App\Form;

use App\Entity\Scene1;

class SaveArtworkG1Type extends SaveArtworkBaseType
{
    protected function getDataClass(): string
    {
        return Scene1::class;
    }
}
