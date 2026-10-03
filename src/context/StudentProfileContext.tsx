import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getCurrentUser, getToken, type Student } from "../lib/auth";

interface StudentProfileContextValue {
  student: Student | null;
  loading: boolean;
  refreshStudent: () => Promise<Student | null>;
  updateStudent: (student: Student) => void;
}

const StudentProfileContext =
  createContext<StudentProfileContextValue | undefined>(undefined);

export function StudentProfileProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshStudent = useCallback(async () => {
    const token = getToken();

    if (!token) {
      setStudent(null);
      setLoading(false);
      return null;
    }

    try {
      const user = await getCurrentUser();
      setStudent(user);
      return user;
    } catch (error) {
      console.error("Could not load shared student profile:", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStudent = useCallback((updatedStudent: Student) => {
    setStudent(updatedStudent);
  }, []);

  useEffect(() => {
    void refreshStudent();
  }, [refreshStudent]);

  const value = useMemo(
    () => ({
      student,
      loading,
      refreshStudent,
      updateStudent,
    }),
    [student, loading, refreshStudent, updateStudent],
  );

  return (
    <StudentProfileContext.Provider value={value}>
      {children}
    </StudentProfileContext.Provider>
  );
}

export function useStudentProfile() {
  const context = useContext(StudentProfileContext);

  if (!context) {
    throw new Error(
      "useStudentProfile must be used inside StudentProfileProvider",
    );
  }

  return context;
}
