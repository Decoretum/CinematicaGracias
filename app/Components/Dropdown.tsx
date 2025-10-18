import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import {useRouter} from 'next/navigation'

export default function SelectBasic() {
    const router = useRouter();

    function navigate(val : string) {
        router.push(`/${val}`);
    }



    return (
        <Select placeholder='Menu' onChange= {(e, val) => navigate(val)}>
            <Option value="">Home</Option>
            <Option value="films">Films</Option>
            <Option value="directors">Directors</Option>
            <Option value="producers">Producers</Option>
            <Option value="actors">Actors</Option>
        </Select>
    );
}
