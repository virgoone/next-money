"use client";

import * as React from "react";

import { PopoverProps } from "@radix-ui/react-popover";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoraConfig, loras, model } from "@/config/constants";
import { useMutationObserver } from "@/hooks/use-mutation-observer";
import { cn } from "@/lib/utils";

import { Icons } from "../shared/icons";
import { Model, ModelType } from "./models";

interface ModelSelectorProps extends PopoverProps {
  types: readonly ModelType[];
  models: Model[];
  selectedModel: Model;
  lora: string
  onLoraChange: (lora: string) => void;
  onChange: (model: Model) => void;
}

export function ModelSelector({
  models,
  types,
  selectedModel,
  onChange,
  lora,
  onLoraChange,
  ...props
}: ModelSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [peekedModel, setPeekedModel] = React.useState<Model>(models[0]);
  const t = useTranslations("Playground");

  return (
    <div className="flex flex-col gap-2">
      <div className="grid gap-2">
        <HoverCard openDelay={500}>
          <HoverCardTrigger asChild>
            <Label htmlFor="model">{t("form.model")}</Label>
          </HoverCardTrigger>
          <HoverCardContent
            align="start"
            className="w-[150px] text-sm md:w-[260px]"
            side="left"
          >
            {t("form.modelTooltip")}
          </HoverCardContent>
        </HoverCard>
        <Popover open={open} onOpenChange={setOpen} {...props}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              aria-label="Select a model"
              className="w-full justify-between"
            >
              {selectedModel ? selectedModel.name : "Select a model..."}

              <Icons.CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-[250px] p-0">
            <HoverCard>
              <HoverCardContent
                side="left"
                align="start"
                forceMount
                className="min-h-[120px]"
              >
                <div className="grid gap-2">
                  <h4 className="font-medium leading-none">
                    {peekedModel.name}
                  </h4>
                  <div className="text-sm text-muted-foreground">
                    {peekedModel.description}
                  </div>
                  {peekedModel.strengths ? (
                    <div className="mt-4 grid gap-2">
                      <h5 className="text-sm font-medium leading-none">
                        Strengths
                      </h5>
                      <ul className="text-sm text-muted-foreground">
                        {peekedModel.strengths}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </HoverCardContent>
              <Command loop>
                <CommandList className="h-[var(--cmdk-list-height)] max-h-[400px]">
                  <CommandInput placeholder="Search Models..." />
                  <CommandEmpty>No Models found.</CommandEmpty>
                  <HoverCardTrigger />
                  {types.map((type) => (
                    <CommandGroup key={type} heading={type}>
                      {models
                        .filter((model) => model.type === type)
                        .map((model) => (
                          <ModelItem
                            key={model.id}
                            model={model}
                            isSelected={selectedModel?.id === model.id}
                            onPeek={(model) => setPeekedModel(model)}
                            onSelect={() => {
                              onChange(model);
                              setOpen(false);
                            }}
                          />
                        ))}
                    </CommandGroup>
                  ))}
                </CommandList>
              </Command>
            </HoverCard>
          </PopoverContent>
        </Popover>
      </div>
      {selectedModel.id === model.general && (
        <div className="grid gap-2">
          <Label htmlFor="lora">{t("form.lora")}</Label>
          <Select value={lora} onValueChange={(value) => onLoraChange(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("form.loraTooltip")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t("form.loraLabel")}</SelectLabel>
                {Object.keys(LoraConfig).map((key) => (
                  <SelectItem value={key}>
                    {LoraConfig[key].styleName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}

interface ModelItemProps {
  model: Model;
  isSelected: boolean;
  onSelect: () => void;
  onPeek: (model: Model) => void;
}

function ModelItem({ model, isSelected, onSelect, onPeek }: ModelItemProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  useMutationObserver(ref, (mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "aria-selected" &&
        ref.current?.getAttribute("aria-selected") === "true"
      ) {
        onPeek(model);
      }
    });
  });

  return (
    <CommandItem
      key={model.id}
      onSelect={onSelect}
      ref={ref}
      className="data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground"
    >
      {model.name}
      <Icons.CheckIcon
        className={cn(
          "ml-auto h-4 w-4",
          isSelected ? "opacity-100" : "opacity-0",
        )}
      />
    </CommandItem>
  );
}
