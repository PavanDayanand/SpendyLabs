import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type Signup = { email: string; consent: boolean; website: string };
type WaitlistState = {
  status: "idle" | "loading" | "success" | "error";
  error: string;
};
const initialState: WaitlistState = { status: "idle", error: "" };

// A thunk handles the async work. The slice below handles its three outcomes.
export const joinWaitlist = createAsyncThunk<
  string,
  Signup,
  { rejectValue: string }
>("waitlist/join", async (signup, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signup),
    });
    const data = await response.json();
    if (!response.ok)
      return rejectWithValue(data.message || "Please try again.");
    return data.message;
  } catch {
    return rejectWithValue("Could not connect. Please try again in a moment.");
  }
});

const waitlistSlice = createSlice({
  name: "waitlist",
  initialState,
  reducers: { resetWaitlist: () => initialState },
  extraReducers: (builder) => {
    builder
      .addCase(joinWaitlist.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(joinWaitlist.fulfilled, (state) => {
        state.status = "success";
      })
      .addCase(joinWaitlist.rejected, (state, action) => {
        state.status = "error";
        state.error =
          action.payload || "Something went wrong. Please try again.";
      });
  },
});
export const { resetWaitlist } = waitlistSlice.actions;
export default waitlistSlice.reducer;
