import { Display } from "@/enums";

import { DogInfo } from "@/Interface/dogInterface";
import { Button } from "antd";
import React, { useState } from "react";

interface Props {
  display: Display;
  onSave: (dogs: DogInfo[]) => void;
}

const ModifyDogSection: React.FC<Props> = ({ display, onSave }) => {
  const [dogs, setDogs] = useState<DogInfo[]>([]);

  return display == Display.FORM ? (
    "form"
  ) : display == Display.COLLAPSE ? (
    // <Button onClick={() => onSave(dogs)}>save</Button>
    <Button>添加狗狗</Button>
  ) : (
    <></>
  );
};

export default ModifyDogSection;
