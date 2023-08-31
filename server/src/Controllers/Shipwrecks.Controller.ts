import { shipwrecks } from '../Models/Shipwreck.model';

export const getAllShipwrecks = async (_req: any, res: { send: (arg0: any) => void; }, next: any) => {
    try {
      const results = await shipwrecks.find({});
      res.send(results);
    } catch (error) {
      console.log(error);
    }
};