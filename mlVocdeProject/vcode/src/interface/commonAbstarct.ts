import clickVcode from "../api/components/clickVcode/clickVcode";
import puzzleVcode from "../api/components/puzzleVcode/puzzleVcode";
import roateVcode from "../api/components/roateVcode/roateVcode";
export interface VcodeTypeStore {
    'clickVcode': typeof clickVcode;
    'puzzleVcode': typeof puzzleVcode;
    'roateVcode': typeof roateVcode;
}