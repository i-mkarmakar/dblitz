import React, { ChangeEvent } from "react";
import { Handle, Node, NodeProps, Position, useReactFlow } from "@xyflow/react";
import { Attribute } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExpandIcon, PlusIcon, ShrinkIcon, Trash2Icon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { attributeTypes } from "@/lib/constants";

export type EntityNodeProps = Node<
  {
    name: string;
    attributes: Array<{ name: string; type: Attribute }>;
    open: boolean;
  },
  "entity"
>;

export default function EntityNode({ data, id }: NodeProps<EntityNodeProps>) {
  const { setNodes, setEdges } = useReactFlow();
  
  const onChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setNodes((nodes) => {
      const nodeIndex = nodes.findIndex((node) => node.id === id);
      if (nodeIndex === -1) return nodes;
      const node = nodes[nodeIndex];
      return [
        ...nodes.slice(0, nodeIndex),
        {
          ...node,
          data: { ...node.data, [evt.target.name]: evt.target.value },
        },
        ...nodes.slice(nodeIndex + 1),
      ];
    });
  };

  const onAttributeChange = (index: number, name: string, value: string) => {
    setNodes((nodes: Node[]) => {
      const nodeIndex = nodes.findIndex((node) => node.id === id);
      if (nodeIndex === -1) return nodes;
      const node = nodes[nodeIndex];
      return [
        ...nodes.slice(0, nodeIndex),
        {
          ...node,
          data: {
            ...node.data,
            attributes: ((node as EntityNodeProps).data.attributes || []).map(
              (attr, i) => (i === index ? { ...attr, [name]: value } : attr)
            ),
          },
        },
        ...nodes.slice(nodeIndex + 1),
      ];
    });
  };

  const onAddAttribute = () => {
    setNodes((nodes: Node[]) => {
      const nodeIndex = nodes.findIndex((node) => node.id === id);
      if (nodeIndex === -1) return nodes;
      const node = nodes[nodeIndex];
      return [
        ...nodes.slice(0, nodeIndex),
        {
          ...node,
          data: {
            ...node.data,
            attributes: [
              ...((node as EntityNodeProps).data.attributes || []),
              { name: "", type: "string" },
            ],
          },
        },
        ...nodes.slice(nodeIndex + 1),
      ];
    });
  };

  const onOpenChange = () => {
    setNodes((nodes: Node[]) => {
      const nodeIndex = nodes.findIndex((node) => node.id === id);
      if (nodeIndex === -1) return nodes;
      const node = nodes[nodeIndex];
      return [
        ...nodes.slice(0, nodeIndex),
        {
          ...node,
          data: {
            ...node.data,
            open: !node.data.open,
          },
        },
        ...nodes.slice(nodeIndex + 1),
      ];
    });
  };

  const deleteNode = () => {
    setEdges((edges) =>
      edges.filter((edge) => edge.source !== id && edge.target !== id)
    );
    setNodes((nodes: Node[]) => {
      return nodes.filter((node) => node.id !== id);
    });
  };

  const onRemoveAttribute = (index: number) => {
    setNodes((nodes: Node[]) => {
      const nodeIndex = nodes.findIndex((node) => node.id === id);
      if (nodeIndex === -1) return nodes;
      const node = nodes[nodeIndex];
      return [
        ...nodes.slice(0, nodeIndex),
        {
          ...node,
          data: {
            ...node.data,
            attributes: (
              (node as EntityNodeProps).data.attributes || []
            ).filter((_, i) => i !== index),
          },
        },
        ...nodes.slice(nodeIndex + 1),
      ];
    });
  };

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className="border border-foreground rounded p-2 bg-background">
        <Input
          value={data.name}
          placeholder="Entity Name"
          name="name"
          onChange={onChange}
        />
        {data.open && (
          <div className="mt-2 flex flex-col gap-2">
            {data.attributes.map((attr, index) => (
              <div
                key={index}
                className="grid grid-cols-[2fr_1fr_0.25fr] gap-2"
              >
                <Input
                  name="name"
                  placeholder="Attribute Name"
                  value={attr.name}
                  onChange={(e) =>
                    onAttributeChange(index, e.target.name, e.target.value)
                  }
                />
                <Select
                  value={String(attr.type)}
                  defaultValue={attributeTypes[0]}
                  onValueChange={(v) => onAttributeChange(index, "type", v)}
                >
                  <SelectTrigger className="w-full">
                    <div className="w-full">
                      {attr.type}
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {attributeTypes.map((attrType, idx) => (
                      <SelectItem
                        key={`attribute-type-select-${idx}`}
                        value={String(attrType)}
                      >
                        {String(attrType)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="destructive"
                  onClick={() => onRemoveAttribute(index)}
                  className="cursor-pointer"
                >
                  <Trash2Icon size={20} />
                </Button>
              </div>
            ))}
            <Button
              onClick={onAddAttribute}
              className="w-full col-span-2 mt-2 cursor-pointer text-white bg-[#ff5941] hover:bg-[#ff5941]/90"
            >
              <PlusIcon size={20} />
            </Button>
          </div>
        )}
        <div className="flex gap-2 mt-2 flex-row">
          <Button onClick={onOpenChange} className="flex-1 cursor-pointer">
            {data.open ? <ShrinkIcon size={20} /> : <ExpandIcon size={20} />}
          </Button>
          <Button
            variant="destructive"
            onClick={deleteNode}
            className="flex-1 cursor-pointer"
          >
            <Trash2Icon />
          </Button>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </>
  );
}
