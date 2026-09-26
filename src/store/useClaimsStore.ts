import { create } from 'zustand'
import { Claim } from '../types'

interface ClaimsState {
  claims: Claim[];
  filteredClaims: Claim[];
  searchQuery: string;
  filterProcedure: string;
  filterType: string;
  filterStatus: string;
  setClaims: (claims: Claim[]) => void;
  setSearchQuery: (query: string) => void;
  setFilterProcedure: (procedure: string) => void;
  setFilterType: (type: string) => void;
  setFilterStatus: (status: string) => void;
  updateClaim: (az: string, updates: Partial<Claim>) => void;
  getStats: () => any;
}

export const useClaimsStore = create<ClaimsState>((set, get) => ({
  claims: [],
  filteredClaims: [],
  searchQuery: '',
  filterProcedure: '',
  filterType: '',
  filterStatus: '',

  setClaims: (claims) => { set({ claims }); get().applyFilters(); },
  setSearchQuery: (query) => { set({ searchQuery: query }); get().applyFilters(); },
  setFilterProcedure: (procedure) => { set({ filterProcedure: procedure }); get().applyFilters(); },
  setFilterType: (type) => { set({ filterType: type }); get().applyFilters(); },
  setFilterStatus: (status) => { set({ filterStatus: status }); get().applyFilters(); },

  applyFilters: () => {
    const { claims, searchQuery, filterProcedure, filterType, filterStatus } = get();
    let filtered = [...claims];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(c => c.AZ.toLowerCase().includes(q) || c.Name1.toLowerCase().includes(q) || c.Betreff.toLowerCase().includes(q) || c.V_Name1.toLowerCase().includes(q));
    }
    if (filterProcedure) filtered = filtered.filter(c => c.Verfahrensstand === filterProcedure);
    if (filterType) filtered = filtered.filter(c => c.Forderungsart === filterType);
    if (filterStatus === 'open') filtered = filtered.filter(c => !c.Erledigt);
    else if (filterStatus === 'completed') filtered = filtered.filter(c => c.Erledigt);
    set({ filteredClaims: filtered });
  },

  updateClaim: (az, updates) => {
    set((state) => ({ claims: state.claims.map(c => c.AZ === az ? { ...c, ...updates } : c) }));
    get().applyFilters();
  },

  getStats: () => {
    const { claims } = get();
    const totalClaims = claims.length;
    const completedClaims = claims.filter(c => c.Erledigt).length;
    const openClaims = totalClaims - completedClaims;
    const totalAmount = claims.reduce((sum, c) => sum + c.Gesamtforderung, 0);
    const byProcedure: Record<string, number> = {};
    const byCreditor: Record<string, number> = {};
    const byType: Record<string, number> = {};
    claims.forEach(c => {
      byProcedure[c.Verfahrensstand] = (byProcedure[c.Verfahrensstand] || 0) + 1;
      byCreditor[c.V_Name1] = (byCreditor[c.V_Name1] || 0) + 1;
      byType[c.Forderungsart] = (byType[c.Forderungsart] || 0) + 1;
    });
    return { totalClaims, openClaims, completedClaims, totalAmount, byProcedure, byCreditor, byType };
  },
}))
