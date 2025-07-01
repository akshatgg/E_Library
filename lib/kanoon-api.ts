// indiankanoonAPI.ts
import axios from "axios";

const INDIAN_KANOON_TOKEN = "1aa778133ee38ba5f0b461e825d90b433a14dbe7";
const INDIAN_KANOON_ENDPOINT = "https://api.indiankanoon.org";

export interface IKanoonResult {
  tid: number;
  title: string;
  headline: string;
  publishdate: string;
  docsource: string;
  numcitedby: number;
  docsize: number;
}

export async function fetchIndianKanoonData(pageNum: number): Promise<IKanoonResult[]> {
  try {
    const formInput =
      "income tax act ORR gst act ORR itr filing ORR section 139 ORR section 143 ORR section 147 ORR section 148 doctypes:highcourts,supremecourt,tribunals,laws,judgments";

    const response = await axios.post(
      `INDIAN_KANOON_ENDPOINT/search`,
      new URLSearchParams({
        formInput,
        pagenum: pageNum.toString(),
      }),
      {
        headers: {
          Authorization: `Token ${INDIAN_KANOON_TOKEN}`,
          Accept: "application/json",
        },
      }
    );

    return response.data?.docs || [];
  } catch (error) {
    console.error("Error fetching Indian Kanoon data:", error);
    return [];
  }
}
export async function fetchIndianKanoonTotalPages(): Promise<number> {
  try {
    const response = await axios.get(`${INDIAN_KANOON_ENDPOINT}total_pages/`, {
      headers: {
        Authorization: `Token ${INDIAN_KANOON_TOKEN}`,
        Accept: "application/json",
      },
    });

    return response.data?.total_pages || 0;
  } catch (error) {
    console.error("Error fetching total pages from Indian Kanoon:", error);
    return 0;
  }
}
export async function fetchCaseByTid(tid: number): Promise<any> {

  try {
    const response = await axios.post(`INDIAN_KANOON_ENDPOINT/doc/${tid}`, {
      headers: {
        'Authorization': `Token ${INDIAN_KANOON_TOKEN}`,
        'Accept': 'application/json',
      },
    });

    if (response.status < 200 || response.status >= 300) {
      throw new Error(`Error fetching TID ${tid}: ${response.statusText}`);
    }

    return response.data;
  } catch (error: any) {
    console.error('Error in fetchCaseByTid:', error.message);
    throw error;
  }
}






