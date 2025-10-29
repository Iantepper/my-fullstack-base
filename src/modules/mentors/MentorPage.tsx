import { List, ListItem, ListItemText } from "@mui/material";
import mockMentors from "../../data/mock/mentors";

export default function MentorsPage() {
  return (
    <div>
      <h2>Mentores</h2>
      <List>
        {mockMentors.map(m => (
          <ListItem key={m.id}>
            <ListItemText primary={m.name} secondary={m.expertise} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}
