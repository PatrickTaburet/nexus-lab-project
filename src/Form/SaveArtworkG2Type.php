<?php

namespace App\Form;

use App\Entity\Scene2;

class SaveArtworkG2Type extends SaveArtworkBaseType
{
    protected function getDataClass(): string
    {
        return Scene2::class;
    }
}
