// Give it a tile to animate, and tiles to cycle through
// https://gbstudiocentral.com/tips/animating-background-tiles-3-1/
export const id = "EVENT_BG_TRAIN_ANIMATOR";
export const groups = ["EVENT_GROUP_SCENE"];
export const name = "BG Train Animator";
export const description = "Animate a train moving in the background.";

// VM_REPLACE_TILE_XY https://www.gbstudio.dev/docs/scripting/gbvm/gbvm-operations/#vm_replace_tile_xy
// VM_SET_CONST https://www.gbstudio.dev/docs/scripting/gbvm/gbvm-operations#vm_set_const
// VM_POP https://www.gbstudio.dev/docs/scripting/gbvm/gbvm-operations#vm_pop

export const swapTile = (sourceIDX, target_x, target_y, sourceName, helpers) => {
  const { _addComment, appendRaw} = helpers;
  _addComment("Swapping tile");
  appendRaw(`VM_PUSH_CONST ${sourceIDX}`);
  appendRaw(`VM_REPLACE_TILE_XY ${target_x}, ${target_y}, ___bank_bg_${sourceName}_tileset, _bg_${sourceName}_tileset, .ARG0`);
  appendRaw(`VM_POP 1`);
};

export const fields = [].concat(
    [
        // Top Left tile
        {
            key: "nose_tip_x",
            label: "Nose Tip X",
            description: "Top most tile x position of the tip of the nose of the train in the direction it is going",
            type: "number",
            min: -96,
            max: 96,
            defaultValue: 0,
            width: "50%",
          },
          {
            key: "nose_tip_y",
            label: "Nose Tip Y",
            description: "Top most tile y position of the tip of the nose of the train in the direction it is going",
            type: "number",
            min: -96,
            max: 96,
            defaultValue: 0,
            width: "50%",
          },
          {
            key: "is_bullet_train",
            label: "Is Bullet Train",
            description: "True if train is the bullet train, false if you want the commuter train",
            type: "number",
            min: -96,
            max: 96,
            defaultValue: 0,
            width: "50%",
          },
          {
            key: "is_travel_left",
            label: "Travelling Left",
            description: "True if train is going to the left, false if going right",
            type: "number",
            min: -96,
            max: 96,
            defaultValue: 0,
            width: "50%",
          },
          {
            key: "loop_time",
            label: "Loop Time",
            description: "How many frames should we wait before the train comes back through",
            type: "number",
            min: -96,
            max: 96,
            defaultValue: 0,
            width: "50%",
          },
          {
            key: "visible_min",
              label: "Visible X Min",
              description: "The left-most (minimum) x position where the train is visible",
              type: "number",
              min: -96,
              max: 96,
              defaultValue: 0,
              width: "50%",
            },
            {
                key: "visible_max",
                label: "Visible X Max",
                description: "The right-most (maximum) x position where the train is visible",
                type: "number",
                min: -96,
                max: 96,
                defaultValue: 0,
                width: "50%",
            },
    ],
    [
        // Source tile
        {
            key: "current_frame",
            label: "Current Frame",
            description: "Which variable is tracking our current frame",
            type: "variable",
            defaultValue: "LAST_VARIABLE"
          },
          {
            key: "source_name",
            label: "Tilemap Source",
            description: "The name of the background you are getting tiles from. from the GBVM name it should be the _bg_[Tilemap source name here]",
            type: "text",
            placeholder: "",
            multiple: false,
            defaultValue: "",
            flexBasis: "100%",
          }
    ]
)

export const compile = (input, helpers) => {
    const { _addComment, appendRaw, ifVariableValue,
      ifVariableCompare, variableValueOperation, variableSetToValue, ifExpression} = helpers;
    const { nose_tip_x, nose_tip_y, is_bullet_train, is_travel_left,
        loop_time, visible_min, visible_max, current_frame, source_name } = input;
    _addComment("Train Update");
    // If they picked the bullet train...
    if(is_bullet_train)
    {
    // For the bullet train, if our current frame count is <= the total length of the train
    ifVariableValue(current_frame, ".LTE", 20, () => {
      _addComment("Set to Frame 0 values");
      // Row 1
      swapTile(0,top_left_x,top_left_y,source_name,{_addComment, appendRaw});
      swapTile(1,top_left_x+1,top_left_y,source_name,{_addComment, appendRaw});
      swapTile(2,top_left_x+2,top_left_y,source_name,{_addComment, appendRaw});
      // Row 2
      swapTile(3,top_left_x,top_left_y+1,source_name,{_addComment, appendRaw});
      swapTile(4,top_left_x+1,top_left_y+1,source_name,{_addComment, appendRaw});
      swapTile(31,top_left_x+2,top_left_y+1,source_name,{_addComment, appendRaw});
      swapTile(1,top_left_x+3,top_left_y+1,source_name,{_addComment, appendRaw});
      // Row 3
      swapTile(5,top_left_x,top_left_y+2,source_name,{_addComment, appendRaw});
      swapTile(6,top_left_x+1,top_left_y+2,source_name,{_addComment, appendRaw});
      swapTile(7,top_left_x+2,top_left_y+2,source_name,{_addComment, appendRaw});
      swapTile(4,top_left_x+3,top_left_y+2,source_name,{_addComment, appendRaw});
      // Row 4
      swapTile(8,top_left_x,top_left_y+3,source_name,{_addComment, appendRaw});
      swapTile(9,top_left_x+1,top_left_y+3,source_name,{_addComment, appendRaw});
      swapTile(10,top_left_x+2,top_left_y+3,source_name,{_addComment, appendRaw});
      swapTile(6,top_left_x+3,top_left_y+3,source_name,{_addComment, appendRaw});
      // Row 5
      swapTile(11,top_left_x+2,top_left_y+4,source_name,{_addComment, appendRaw});
      swapTile(9,top_left_x+3,top_left_y+4,source_name,{_addComment, appendRaw});
      // Then increment the current frame
      variableValueOperation(current_frame,".ADD",1);
    }, () => {
      ifVariableValue(current_frame, ".EQ",1, () => {
        _addComment("Set to Frame 1 values");
        // Row 1
        swapTile(12,top_left_x,top_left_y,source_name,{_addComment, appendRaw});
        swapTile(13,top_left_x+1,top_left_y,source_name,{_addComment, appendRaw});
        swapTile(14,top_left_x+2,top_left_y,source_name,{_addComment, appendRaw});
        // Row 2
        swapTile(15,top_left_x,top_left_y+1,source_name,{_addComment, appendRaw});
        swapTile(16,top_left_x+1,top_left_y+1,source_name,{_addComment, appendRaw});
        swapTile(17,top_left_x+2,top_left_y+1,source_name,{_addComment, appendRaw});
        swapTile(13,top_left_x+3,top_left_y+1,source_name,{_addComment, appendRaw});
        // Row 3
        swapTile(18,top_left_x,top_left_y+2,source_name,{_addComment, appendRaw});
        swapTile(19,top_left_x+1,top_left_y+2,source_name,{_addComment, appendRaw});
        swapTile(20,top_left_x+2,top_left_y+2,source_name,{_addComment, appendRaw});
        swapTile(16,top_left_x+3,top_left_y+2,source_name,{_addComment, appendRaw});
        // Row 4
        swapTile(21,top_left_x,top_left_y+3,source_name,{_addComment, appendRaw});
        swapTile(22,top_left_x+1,top_left_y+3,source_name,{_addComment, appendRaw});
        swapTile(23,top_left_x+2,top_left_y+3,source_name,{_addComment, appendRaw});
        swapTile(19,top_left_x+3,top_left_y+3,source_name,{_addComment, appendRaw});
        // Row 5
        swapTile(24,top_left_x+2,top_left_y+4,source_name,{_addComment, appendRaw});
        swapTile(22,top_left_x+3,top_left_y+4,source_name,{_addComment, appendRaw});
        // Then increment the current frame
        variableValueOperation(current_frame,".ADD",1);
      }, () => {
        ifVariableValue(current_frame, ".EQ", 2, () => {
          _addComment("Set to Frame 2 values");
          // Row 1
          swapTile(18,top_left_x,top_left_y,source_name,{_addComment, appendRaw});
          swapTile(19,top_left_x+1,top_left_y,source_name,{_addComment, appendRaw});
          swapTile(25,top_left_x+2,top_left_y,source_name,{_addComment, appendRaw});
          // Row 2
          swapTile(21,top_left_x,top_left_y+1,source_name,{_addComment, appendRaw});
          swapTile(22,top_left_x+1,top_left_y+1,source_name,{_addComment, appendRaw});
          swapTile(23,top_left_x+2,top_left_y+1,source_name,{_addComment, appendRaw});
          swapTile(19,top_left_x+3,top_left_y+1,source_name,{_addComment, appendRaw});
          // Row 3
          swapTile(12,top_left_x,top_left_y+2,source_name,{_addComment, appendRaw});
          swapTile(13,top_left_x+1,top_left_y+2,source_name,{_addComment, appendRaw});
          swapTile(26,top_left_x+2,top_left_y+2,source_name,{_addComment, appendRaw});
          swapTile(22,top_left_x+3,top_left_y+2,source_name,{_addComment, appendRaw});
          // Row 4
          swapTile(15,top_left_x,top_left_y+3,source_name,{_addComment, appendRaw});
          swapTile(16,top_left_x+1,top_left_y+3,source_name,{_addComment, appendRaw});
          swapTile(17,top_left_x+2,top_left_y+3,source_name,{_addComment, appendRaw});
          swapTile(13,top_left_x+3,top_left_y+3,source_name,{_addComment, appendRaw});
          // Row 5
          swapTile(27,top_left_x+2,top_left_y+4,source_name,{_addComment, appendRaw});
          swapTile(16,top_left_x+3,top_left_y+4,source_name,{_addComment, appendRaw});
          // Then increment the current frame
          variableValueOperation(current_frame,".ADD",1);
        }, () => {
          _addComment("Set to Frame 3 values");
          // Row 1
          swapTile(5,top_left_x,top_left_y,source_name,{_addComment, appendRaw});
          swapTile(6,top_left_x+1,top_left_y,source_name,{_addComment, appendRaw});
          swapTile(25,top_left_x+2,top_left_y,source_name,{_addComment, appendRaw});
          // Row 2
          swapTile(8,top_left_x,top_left_y+1,source_name,{_addComment, appendRaw});
          swapTile(9,top_left_x+1,top_left_y+1,source_name,{_addComment, appendRaw});
          swapTile(10,top_left_x+2,top_left_y+1,source_name,{_addComment, appendRaw});
          swapTile(6,top_left_x+3,top_left_y+1,source_name,{_addComment, appendRaw});
          // Row 3
          swapTile(0,top_left_x,top_left_y+2,source_name,{_addComment, appendRaw});
          swapTile(1,top_left_x+1,top_left_y+2,source_name,{_addComment, appendRaw});
          swapTile(11,top_left_x+2,top_left_y+2,source_name,{_addComment, appendRaw});
          swapTile(9,top_left_x+3,top_left_y+2,source_name,{_addComment, appendRaw});
          // Row 4
          swapTile(3,top_left_x,top_left_y+3,source_name,{_addComment, appendRaw});
          swapTile(4,top_left_x+1,top_left_y+3,source_name,{_addComment, appendRaw});
          swapTile(31,top_left_x+2,top_left_y+3,source_name,{_addComment, appendRaw});
          swapTile(1,top_left_x+3,top_left_y+3,source_name,{_addComment, appendRaw});
          // Row 5
          swapTile(28,top_left_x+2,top_left_y+4,source_name,{_addComment, appendRaw});
          swapTile(4,top_left_x+3,top_left_y+4,source_name,{_addComment, appendRaw});
          // Then increment the current frame
          variableSetToValue(current_frame,0);
        });
      });
    });
    }
    else {
        
    }
}