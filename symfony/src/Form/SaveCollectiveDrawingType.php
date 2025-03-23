<?php

namespace App\Form;

use App\Entity\CollectiveDrawing;

class SaveCollectiveDrawingType extends BaseSaveArtworkType
{
    protected function getDataClass(): string
    {
        return CollectiveDrawing::class;
    }
}
