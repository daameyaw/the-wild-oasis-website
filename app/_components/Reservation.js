import { auth } from "../_lib/auth";
import { getBookedDatesByCabinId, getSettings } from "../_lib/data-service";
import DateSelector from "./DateSelector";
import LoginMessage from "./LoginMessage";
import ReservationForm from "./ReservationForm";

export default async function Reservation({ cabin }) {
  const session = await auth();

  /* The code snippet `const [cabin, settings, bookedDates] = Promise.all([...]);` is using
`Promise.all()` to concurrently execute multiple asynchronous functions `getCabin(params.cabinId)`,
`getBookedDatesByCabinId(params.cabinId)`, and `getSettings()`. */

  const [settings, bookedDates] = await Promise.all([
    getBookedDatesByCabinId(cabin.id),
    getSettings(),
  ]);

  return (
    <div className="grid grid-cols-2   border border-primary-800 min-h-[400px]">
      <DateSelector
        settings={settings}
        bookedDates={bookedDates}
        cabin={cabin}
      />
      {session?.user ? <ReservationForm cabin={cabin} user={session.user} /> : <LoginMessage />}
    </div>
  );
}
